-- Tài khoản khách (đợt 2): địa chỉ nhận hàng, gắn đơn với khách đang đăng nhập, lịch sử đơn.
-- Không đổi cách tính tiền/tồn của place_order; chỉ thêm bước gắn customer_id sau khi đơn đã tạo xong.

-- 1) Địa chỉ nhận hàng thường dùng (khách tự sửa ở trang Tài khoản)
alter table public.customers
  add column province text check (province is null or char_length(province) <= 80),
  add column ward text check (ward is null or char_length(ward) <= 80),
  add column street text check (street is null or char_length(street) <= 200);
grant update (province, ward, street) on public.customers to authenticated;

-- 2) Đơn thuộc tài khoản khách nào (null = đặt khi chưa đăng nhập)
alter table public.orders add column customer_id uuid references public.customers(id) on delete set null;
create index orders_customer_id_idx on public.orders (customer_id, created_at desc) where customer_id is not null;

-- 3) Đặt hàng: giữ nguyên logic cũ, thêm gắn khách. Mã khách lấy từ phiên đăng nhập (auth.uid()),
--    không nhận từ dữ liệu trình duyệt gửi lên. Nhân viên/khách vãng lai → không gắn.
create or replace function public.place_order(payload jsonb)
 returns jsonb
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare v_result jsonb; v_order public.orders; v_until timestamptz;
begin
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
end $function$;

-- 4) Lịch sử đơn của khách đang đăng nhập (50 đơn gần nhất), cùng dạng dữ liệu với lookup_order
create or replace function public.customer_orders()
 returns jsonb
 language sql
 stable
 security definer
 set search_path to ''
as $function$
  select coalesce(jsonb_agg(x order by x->>'created_at' desc), '[]'::jsonb) from (
    select jsonb_build_object(
      'code', o.code, 'status', o.status, 'delivery', o.delivery, 'subtotal', o.subtotal,
      'shipping_fee', o.shipping_fee, 'tracking_code', o.tracking_code, 'created_at', o.created_at,
      'payment_method', o.payment_method, 'payment_status', o.payment_status,
      'payment_acceptance', o.payment_acceptance,
      'items', (select jsonb_agg(jsonb_build_object('name', i.name, 'qty', i.qty, 'unit_price', i.unit_price) order by i.id)
                from public.order_items i where i.order_id = o.id)) x
    from public.orders o
    where o.customer_id = (select auth.uid()) and (select auth.uid()) is not null
    order by o.created_at desc
    limit 50) t;
$function$;
revoke all on function public.customer_orders() from public, anon;
grant execute on function public.customer_orders() to authenticated;
