-- CHƯA ÁP DỤNG. Duyệt với chủ shop trước khi chạy trên DB thật.
-- Phát hành mã bỏ customer_identifiers_taken TRƯỚC migration này.
-- CLI tạo timestamp UTC nhỏ hơn một số migration cũ ghi theo giờ địa phương:
-- áp đích danh sau các migration customer_* ngày 12/11, KHÔNG db push hàng loạt.
begin;

-- Không cho dò danh sách SĐT/email trước captcha bằng cách gọi RPC trực tiếp.
revoke execute on function public.customer_identifiers_taken(text, text) from public, anon, authenticated;

-- Giữ nguyên tính giá, trừ/giữ tồn và gắn khách. Khóa chung bảo đảm hai request
-- đồng thời không cùng vượt qua phép đếm giới hạn trong place_order_legacy.
create or replace function public.place_order(payload jsonb)
returns jsonb language plpgsql security definer set search_path to '' as $$
declare
  v_result jsonb;
  v_order public.orders;
  v_until timestamptz;
  v_phone text := private.normalize_phone(payload->>'phone');
begin
  if jsonb_typeof(payload) is distinct from 'object' or pg_column_size(payload) > 20000
     or jsonb_typeof(payload->'items') is distinct from 'array'
     or coalesce(payload->>'delivery', '') not in ('pickup', 'inner', 'province') then
    raise exception 'Dữ liệu đơn hàng không hợp lệ.' using errcode = '22023';
  end if;
  if v_phone is null then
    raise exception 'Số điện thoại cần 10 số, bắt đầu bằng 0.' using errcode = '22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(741113, 1);
  if lower(coalesce(payload->>'pay', 'cod')) = 'bank' and (
    select count(*) from public.orders where phone = v_phone
      and payment_method = 'bank' and payment_status = 'unpaid'
      and status <> 'cancelled' and payment_hold_until > clock_timestamp()
  ) >= 3 then
    raise exception 'Bạn đang có 3 đơn chờ chuyển khoản. Vui lòng thanh toán hoặc chờ hết thời gian giữ hàng.' using errcode = '54000';
  end if;

  v_result := public.place_order_legacy(payload);
  select * into v_order from public.orders where code = v_result->>'code' for update;
  if not found then raise exception 'Không tạo được đơn hàng' using errcode = 'P0002'; end if;
  if v_order.payment_method = 'bank' then
    v_until := clock_timestamp() + interval '30 minutes';
    if not private.reserve_bank_order(v_order.id, v_until) then
      raise exception 'Không còn đủ hàng để giữ cho đơn này. Vui lòng cập nhật giỏ hàng.' using errcode = '22023';
    end if;
    update public.orders set payment_hold_until = v_until,
      payment_auto_until = clock_timestamp() + interval '24 hours', payment_acceptance = 'pending' where id = v_order.id;
  elsif not private.order_stock_available(v_order.id) then
    raise exception 'Không còn đủ hàng cho đơn này. Vui lòng cập nhật giỏ hàng.' using errcode = '22023';
  end if;
  update public.orders set customer_id = c.id
    from public.customers c
   where public.orders.id = v_order.id and c.id = (select auth.uid());
  return v_result;
end $$;
revoke all on function public.place_order(jsonb) from public;
grant execute on function public.place_order(jsonb) to anon, authenticated;

create or replace function public.submit_quote(p_items text, p_phone text)
returns void language plpgsql security definer set search_path to '' as $$
declare v_phone text := private.normalize_phone(p_phone);
begin
  if v_phone is null then raise exception 'Số điện thoại cần 10 số, bắt đầu bằng 0.' using errcode = '22023'; end if;
  if p_items is null or length(btrim(p_items)) < 3 or length(p_items) > 2000 then
    raise exception 'Ghi ít nhất một món và số lượng.' using errcode = '22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(741113, 2);
  if (select count(*) from public.quote_requests where phone = v_phone and created_at > now() - interval '10 minutes') >= 3
     or (select count(*) from public.quote_requests where created_at > now() - interval '10 minutes') >= 20 then
    raise exception 'Shop đang nhận nhiều yêu cầu. Vui lòng thử lại sau ít phút hoặc gọi 0948 732 064.' using errcode = '54000';
  end if;
  insert into public.quote_requests (items, phone) values (btrim(p_items), v_phone);
end $$;
revoke all on function public.submit_quote(text, text) from public;
grant execute on function public.submit_quote(text, text) to anon, authenticated;

commit;
