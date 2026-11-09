-- LƯU TRỮ / ĐÃ VƯỢT QUA: mức 15.000đ mọi đơn giao hàng đã được thay bằng ngưỡng miễn phí từ 500.000đ. Không chạy lại. Xem PHI_SHIP_NGUONG_500000_AP_DUNG.sql.
-- Không cập nhật đơn cũ, không đổi RLS/quyền EXECUTE.
-- Chỉ chạy đồng bộ với bản web mới; trang cũ gửi đơn giao hàng sẽ được yêu cầu tải lại.
BEGIN;
DO $guard$
BEGIN
  PERFORM 1 FROM public.settings WHERE id = 1 FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Không tìm thấy cài đặt shop'; END IF;
  IF md5(replace(pg_get_functiondef('public.place_order(jsonb)'::regprocedure), E'\r\n', E'\n')) <> 'dda57e1efaa50ce7883a64c5b78f6dee' THEN
    RAISE EXCEPTION 'place_order đã thay đổi; dừng để đối chiếu lại';
  END IF;
  IF (SELECT shop->>'shipping_policy' FROM public.settings WHERE id=1) IS NOT NULL THEN
    RAISE EXCEPTION 'Đã có chính sách phí khác; dừng để đối chiếu';
  END IF;
END $guard$;

CREATE OR REPLACE FUNCTION public.place_order(payload jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_name text := btrim(payload->>'name');
  v_phone text := private.normalize_phone(payload->>'phone');
  v_email text := nullif(btrim(coalesce(payload->>'email', '')), '');
  v_delivery public.delivery_method;
  v_province text := nullif(btrim(coalesce(payload->>'province', '')), '');
  v_ward text := nullif(btrim(coalesce(payload->>'ward', '')), '');
  v_street text := nullif(btrim(coalesce(payload->>'street', '')), '');
  v_note text := nullif(btrim(coalesce(payload->>'note', '')), '');
  v_items jsonb := payload->'items';
  v_subtotal bigint := 0;
  v_fee bigint;
  v_restock boolean := false;
  v_order_id bigint;
  v_code text;
  r record;
begin
  if v_name is null or length(v_name) < 1 or length(v_name) > 100 then
    raise exception 'Vui lòng nhập họ tên người nhận.' using errcode = '22023';
  end if;
  if v_phone is null then
    raise exception 'Số điện thoại cần 10 số, bắt đầu bằng 0.' using errcode = '22023';
  end if;
  if v_email is not null and (length(v_email) > 200 or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$') then
    raise exception 'Email chưa đúng dạng.' using errcode = '22023';
  end if;
  begin
    v_delivery := (payload->>'delivery')::public.delivery_method;
  exception when others then
    raise exception 'Cách nhận hàng không hợp lệ.' using errcode = '22023';
  end;
  if v_delivery not in ('pickup', 'inner', 'province') then
    raise exception 'Cách nhận hàng không hợp lệ.' using errcode = '22023';
  end if;
  if v_delivery <> 'pickup' and (v_province is null or v_ward is null or v_street is null
      or length(v_province) > 60 or length(v_ward) > 80 or length(v_street) > 200) then
    raise exception 'Vui lòng nhập đủ địa chỉ nhận hàng.' using errcode = '22023';
  end if;
  if v_note is not null and length(v_note) > 1000 then
    raise exception 'Ghi chú quá dài.' using errcode = '22023';
  end if;
  if jsonb_typeof(v_items) <> 'array' or jsonb_array_length(v_items) = 0 or jsonb_array_length(v_items) > 50 then
    raise exception 'Giỏ hàng trống hoặc quá nhiều món.' using errcode = '22023';
  end if;

  -- Chống spam: 1 SĐT tối đa 3 đơn / 10 phút; toàn shop tối đa 30 đơn web / phút
  if (select count(*) from public.orders where phone = v_phone and created_at > now() - interval '10 minutes') >= 3
     or (select count(*) from public.orders where created_by is null and created_at > now() - interval '1 minute') >= 30 then
    raise exception 'Bạn vừa đặt nhiều đơn. Vui lòng chờ vài phút hoặc gọi shop 0948 732 064.' using errcode = '54000';
  end if;

  -- Gộp món trùng; số lượng phải là số nguyên 1..999
  for r in
    select e->>'sku' as sku, e->>'qty' as qty_raw from jsonb_array_elements(v_items) e
  loop
    if r.qty_raw is null or r.qty_raw !~ '^[0-9]{1,3}$' or r.qty_raw::int < 1 then
      raise exception 'Số lượng không hợp lệ.' using errcode = '22023';
    end if;
  end loop;

  -- Chặn trang cũ chưa hiển thị mức phí mới, trước khi tạo bất kỳ đơn nào.
  if v_delivery <> 'pickup' and coalesce(payload->>'shippingPolicy', '') <> 'flat_15000_v1' then
    raise exception 'Phí giao hàng vừa được cập nhật. Vui lòng tải lại trang trước khi đặt hàng.' using errcode = '22023';
  end if;
  v_fee := case v_delivery when 'pickup' then 0 else 15000 end;

  v_code := 'TTT' || lpad(nextval('public.order_code_seq')::text, 6, '0');
  insert into public.orders (code, customer_name, phone, email, delivery, province, ward, street, note, subtotal, shipping_fee)
  values (v_code, v_name, v_phone, v_email, v_delivery, v_province, v_ward, v_street, v_note, 0, v_fee)
  returning id into v_order_id;

  for r in
    select p.*, sum((e->>'qty')::int)::int as qty
    from jsonb_array_elements(v_items) e
    join public.products p on p.sku = upper(e->>'sku') and p.is_visible
    group by p.id
  loop
    if r.qty > 999 then raise exception 'Số lượng không hợp lệ.' using errcode = '22023'; end if;
    insert into public.order_items (order_id, product_id, sku, name, unit, unit_price, qty)
    values (v_order_id, r.id, r.sku, r.name, r.unit, private.effective_price(r.price, r.sale_price, r.sale_from, r.sale_to), r.qty);
    v_subtotal := v_subtotal + private.effective_price(r.price, r.sale_price, r.sale_from, r.sale_to) * r.qty;
    v_restock := v_restock or not r.in_stock;
  end loop;

  if not exists (select 1 from public.order_items where order_id = v_order_id) then
    raise exception 'Sản phẩm trong giỏ không còn bán. Vui lòng tải lại trang.' using errcode = '22023';
  end if;
  if (select count(*) from public.order_items where order_id = v_order_id)
     <> (select count(distinct upper(e->>'sku')) from jsonb_array_elements(v_items) e) then
    raise exception 'Một số sản phẩm trong giỏ không còn bán. Vui lòng tải lại giỏ hàng.' using errcode = '22023';
  end if;

  update public.orders set subtotal = v_subtotal, shipping_fee = v_fee, needs_restock = v_restock where id = v_order_id;
  insert into public.order_events (order_id, type, note) values (v_order_id, 'created', 'Khách đặt trên web');

  return jsonb_build_object('code', v_code, 'subtotal', v_subtotal, 'shipping_fee', v_fee);
end $function$;

UPDATE public.settings
SET shop = jsonb_set(coalesce(shop, '{}'::jsonb), '{shipping_policy}', '"flat_15000_v1"'::jsonb),
    updated_at = now()
WHERE id = 1;
COMMIT;
