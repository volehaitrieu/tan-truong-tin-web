-- ĐÃ ÁP DỤNG 10/11/2026 theo duyệt của chủ shop; migration Supabase 20261110083306.
-- Đơn chuyển khoản mới giữ hàng 30 phút; SePay tự nhận trong 24 giờ nếu còn đủ hàng.
begin;

do $guard$
declare
  v_expected jsonb := '{"place_order":"af2db53d3ea2ad9fb0ea9f9b8dbb0123","sepay_receive":"563a067056b478bda246f93068de61e0","lookup_order":"38c7e86f0f5b39b636a38703cab24442","order_set_status":"d7b5e1157c6e8781434d9c0922e1a130","order_set_shipping":"04893f66400e184b89fa46a65ce53d95","order_mark_paid":"e3b9fff5761410df2e8a33b4df6f556c","pos_create_order":"7a6adcd421db9854f2cdfdc0e89d8220"}';
  v_name text;
  v_actual text;
begin
  for v_name in select key from jsonb_each_text(v_expected) loop
    select md5(replace(pg_get_functiondef(p.oid), E'\r\n', E'\n')) into v_actual
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = v_name;
    if v_actual is distinct from v_expected->>v_name then
      raise exception 'Hàm % đã đổi; dừng migration để rà lại', v_name;
    end if;
  end loop;
end $guard$;

alter table public.orders
  add column payment_hold_until timestamptz,
  add column payment_auto_until timestamptz,
  add column payment_acceptance text check (payment_acceptance in ('pending', 'accepted', 'review'));

create table private.bank_order_holds (
  order_id bigint not null references public.orders(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete restrict,
  qty integer not null check (qty > 0),
  expires_at timestamptz,
  primary key (order_id, product_id)
);
create index bank_order_holds_product_idx on private.bank_order_holds(product_id, expires_at);
alter table private.bank_order_holds enable row level security;
revoke all on private.bank_order_holds from public, anon, authenticated;

-- Khóa kho theo product_id trước khi tính phần còn lại. Hàng giữ hết hạn tự rời
-- khỏi phép tính nên không cần tác vụ định kỳ để nhả hàng.
create function private.order_stock_available(p_order_id bigint)
returns boolean language plpgsql security definer set search_path = ''
as $$
declare it record; v_have integer; v_held bigint;
begin
  if exists (select 1 from public.order_items where order_id = p_order_id and product_id is null) then
    return false;
  end if;
  for it in select product_id, sum(qty)::integer as qty
            from public.order_items where order_id = p_order_id and product_id is not null
            group by product_id order by product_id
  loop
    select qty into v_have from public.inventory where product_id = it.product_id for update;
    if not found then return false; end if;
    select coalesce(sum(h.qty), 0) into v_held
      from private.bank_order_holds h join public.orders o on o.id = h.order_id
      where h.product_id = it.product_id and h.order_id <> p_order_id
        and o.status = 'pending' and (h.expires_at is null or h.expires_at > clock_timestamp());
    if v_have - v_held < it.qty then return false; end if;
  end loop;
  return found;
end $$;
revoke all on function private.order_stock_available(bigint) from public, anon, authenticated;

create function private.reserve_bank_order(p_order_id bigint, p_expires_at timestamptz)
returns boolean language plpgsql security definer set search_path = ''
as $$
begin
  if not private.order_stock_available(p_order_id) then return false; end if;
  insert into private.bank_order_holds(order_id, product_id, qty, expires_at)
  select p_order_id, product_id, sum(qty)::integer, p_expires_at
  from public.order_items where order_id = p_order_id and product_id is not null
  group by product_id
  on conflict (order_id, product_id) do update
    set qty = excluded.qty, expires_at = excluded.expires_at;
  return true;
end $$;
revoke all on function private.reserve_bank_order(bigint, timestamptz) from public, anon, authenticated;

-- Giữ lại hàm hiện tại để bảo toàn kiểm tra đầu vào, giá, phí ship và giới hạn tần suất.
alter function public.place_order(jsonb) rename to place_order_legacy;
revoke all on function public.place_order_legacy(jsonb) from public, anon, authenticated;
create function public.place_order(payload jsonb)
returns jsonb language plpgsql security definer set search_path = ''
as $$
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
  return v_result;
end $$;
revoke all on function public.place_order(jsonb) from public;
grant execute on function public.place_order(jsonb) to anon, authenticated;

-- Bán tại quầy cũng phải tôn trọng số hàng đã hứa giữ cho khách chuyển khoản.
alter function public.pos_create_order(jsonb, text, text) rename to pos_create_order_legacy;
revoke all on function public.pos_create_order_legacy(jsonb, text, text) from public, anon, authenticated;
create function public.pos_create_order(p_items jsonb, p_phone text default null, p_name text default null)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare it record; v_have integer; v_held bigint;
begin
  perform private.require('pos_sale');
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 100 then
    raise exception 'Chưa chọn sản phẩm.' using errcode = '22023';
  end if;
  for it in select e->>'product_id' as id, e->>'qty' as qty from jsonb_array_elements(p_items) e loop
    if it.id !~ '^[0-9]{1,15}$' or it.qty !~ '^[0-9]{1,4}$' or it.qty::integer < 1 then
      raise exception 'Sản phẩm hoặc số lượng không hợp lệ.' using errcode = '22023';
    end if;
  end loop;
  for it in select (e->>'product_id')::bigint as product_id, sum((e->>'qty')::integer)::integer as qty
            from jsonb_array_elements(p_items) e group by 1 order by 1
  loop
    select qty into v_have from public.inventory where product_id = it.product_id for update;
    if not found then raise exception 'Không tìm thấy tồn kho sản phẩm.' using errcode = '22023'; end if;
    select coalesce(sum(h.qty), 0) into v_held
    from private.bank_order_holds h join public.orders o on o.id = h.order_id
    where h.product_id = it.product_id and o.status = 'pending'
      and (h.expires_at is null or h.expires_at > clock_timestamp());
    if v_have - v_held < it.qty then
      raise exception 'Không còn đủ hàng để bán tại quầy; có hàng đang giữ cho đơn chuyển khoản.' using errcode = '22023';
    end if;
  end loop;
  return public.pos_create_order_legacy(p_items, p_phone, p_name);
end $$;
revoke all on function public.pos_create_order(jsonb, text, text) from public, anon;
grant execute on function public.pos_create_order(jsonb, text, text) to authenticated;

-- Không cho nhân viên xác nhận đơn chuyển khoản khi chưa nhận tiền. Trước khi
-- trừ kho, kiểm tra đủ toàn bộ món và tôn trọng hàng khách khác đang giữ.
alter function public.order_set_status(bigint, public.order_status, text) rename to order_set_status_legacy;
revoke all on function public.order_set_status_legacy(bigint, public.order_status, text) from public, anon, authenticated;
create function public.order_set_status(p_order_id bigint, p_status public.order_status, p_note text default null)
returns void language plpgsql security definer set search_path = ''
as $$
declare v_order public.orders;
begin
  perform private.require(case when p_status = 'cancelled' then 'cancel_orders' else 'process_orders' end);
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Không tìm thấy đơn' using errcode = 'P0002'; end if;
  if p_status = 'confirmed' then
    if v_order.payment_method = 'bank' and
       (v_order.payment_status <> 'paid' or (v_order.payment_acceptance is not null and v_order.payment_acceptance <> 'accepted')) then
      raise exception 'Đơn chuyển khoản chưa được xác nhận đủ tiền và đủ hàng.' using errcode = '22023';
    end if;
    if not private.order_stock_available(p_order_id) then
      raise exception 'Không còn đủ hàng để xác nhận đơn. Vui lòng kiểm tra tồn kho.' using errcode = '22023';
    end if;
  elsif p_status = 'cancelled' and v_order.payment_method = 'bank' and v_order.payment_status = 'paid' then
    raise exception 'Đơn đã nhận tiền; cần xử lý hoàn tiền trước khi hủy.' using errcode = '22023';
  end if;
  perform public.order_set_status_legacy(p_order_id, p_status, p_note);
  if p_status in ('confirmed', 'cancelled') then
    delete from private.bank_order_holds where order_id = p_order_id;
  end if;
end $$;
revoke all on function public.order_set_status(bigint, public.order_status, text) from public, anon;
grant execute on function public.order_set_status(bigint, public.order_status, text) to authenticated;

-- Số tiền QR đã phát hành không được đổi phí giao; vẫn cho nhập mã vận đơn.
alter function public.order_set_shipping(bigint, bigint, text) rename to order_set_shipping_legacy;
revoke all on function public.order_set_shipping_legacy(bigint, bigint, text) from public, anon, authenticated;
create function public.order_set_shipping(p_order_id bigint, p_fee bigint, p_tracking text)
returns void language plpgsql security definer set search_path = ''
as $$
declare v_order public.orders;
begin
  perform private.require('process_orders');
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Không tìm thấy đơn' using errcode = 'P0002'; end if;
  if v_order.payment_method = 'bank'
     and (v_order.payment_hold_until is not null or v_order.payment_status = 'paid')
     and p_fee is distinct from v_order.shipping_fee then
    raise exception 'Phí giao hàng của đơn chuyển khoản đã chốt theo mã QR.' using errcode = '22023';
  end if;
  perform public.order_set_shipping_legacy(p_order_id, p_fee, p_tracking);
end $$;
revoke all on function public.order_set_shipping(bigint, bigint, text) from public, anon;
grant execute on function public.order_set_shipping(bigint, bigint, text) to authenticated;

-- Nhân viên vẫn có thể đối chiếu khoản tiền thủ công; chỉ chấp nhận đơn sau
-- khi đã giữ lại được đủ hàng. Tiền thiếu hoặc sai tài khoản phải xử lý riêng.
alter function public.order_mark_paid(bigint) rename to order_mark_paid_legacy;
revoke all on function public.order_mark_paid_legacy(bigint) from public, anon, authenticated;
create function public.order_mark_paid(p_order_id bigint)
returns void language plpgsql security definer set search_path = ''
as $$
declare v_order public.orders;
begin
  perform private.require('process_orders');
  select * into v_order from public.orders where id = p_order_id for update;
  if not found or v_order.status = 'cancelled' then raise exception 'Không tìm thấy đơn còn hiệu lực' using errcode = 'P0002'; end if;
  if v_order.payment_status = 'paid' and v_order.payment_acceptance is distinct from 'review' then
    raise exception 'Đơn đã được ghi nhận thanh toán.' using errcode = '22023';
  end if;
  if v_order.payment_status = 'paid' and v_order.payment_acceptance = 'review'
     and exists (select 1 from public.sepay_transactions
                 where order_id = p_order_id and status = 'review'
                   and review_reason in ('Quá 24 giờ; shop cần xác minh thủ công',
                                         'Hết thời gian giữ hàng và không còn đủ hàng; shop cần xử lý')) then
    raise exception 'Hãy gắn giao dịch đang chờ kiểm tra ở trang Giao dịch trước.' using errcode = '22023';
  end if;
  if v_order.payment_method = 'bank' and v_order.payment_acceptance is not null then
    if private.reserve_bank_order(p_order_id, null) then
      update public.orders set payment_acceptance = 'accepted', needs_restock = false,
        updated_at = now() where id = p_order_id;
      if v_order.payment_status = 'paid' then
        insert into public.order_events(order_id, type, note, created_by)
        values (p_order_id, 'payment_accepted', 'Đã đối chiếu đủ hàng', (select auth.uid()));
      end if;
    else
      if v_order.payment_status = 'paid' then
        raise exception 'Đơn đã nhận tiền nhưng chưa đủ hàng. Vui lòng bổ sung hàng hoặc xử lý hoàn tiền.' using errcode = '22023';
      end if;
      update public.orders set payment_acceptance = 'review', needs_restock = true, updated_at = now()
      where id = p_order_id;
    end if;
  end if;
  if v_order.payment_status <> 'paid' then perform public.order_mark_paid_legacy(p_order_id); end if;
end $$;
revoke all on function public.order_mark_paid(bigint) from public, anon;
grant execute on function public.order_mark_paid(bigint) to authenticated;

-- Giữ nguyên xác thực chữ ký và chống giao dịch lặp của webhook hiện có;
-- chèn kiểm tra thời hạn/kho ngay trước nhánh ghi nhận thanh toán.
do $patch$
declare
  v_ddl text := replace(pg_get_functiondef('public.sepay_receive(text,text,text)'::regprocedure), E'\r\n', E'\n');
  v_marker text := E'  if v_reason is not null then\n    update public.sepay_transactions set order_id = v_order.id, review_reason = v_reason where id = v_payment_id;';
  v_marker_result text := '  return jsonb_build_object(''success'', true, ''matched'', true);';
  v_marker_paid text := '  update public.orders set payment_status = ''paid'', updated_at = now() where id = v_order.id;';
  v_insert text := E'  if v_reason is null then\n    if v_order.payment_auto_until is null then\n      v_reason := ''Đơn cũ cần shop xác minh thủ công'';\n    elsif clock_timestamp() > v_order.payment_auto_until then\n      v_reason := ''Quá 24 giờ; shop cần xác minh thủ công'';\n    elsif not private.reserve_bank_order(v_order.id, null) then\n      v_reason := ''Hết thời gian giữ hàng và không còn đủ hàng; shop cần xử lý'';\n    end if;\n    if v_reason is not null and v_order.payment_auto_until is not null then\n      update public.orders set payment_status = ''paid'', payment_acceptance = ''review'',\n        needs_restock = (v_reason like ''Hết thời gian giữ hàng%''), updated_at = now() where id = v_order.id;\n      insert into public.order_events(order_id, type, note)\n      values (v_order.id, ''paid'', ''SePay · giao dịch '' || v_id || '' · chờ shop xử lý'');\n    end if;\n  end if;\n\n';
begin
  if (length(v_ddl) - length(replace(v_ddl, v_marker, ''))) / length(v_marker) <> 1 then
    raise exception 'Không tìm thấy duy nhất vị trí đối soát SePay';
  end if;
  if (length(v_ddl) - length(replace(v_ddl, v_marker_result, ''))) / length(v_marker_result) <> 1 then
    raise exception 'Không tìm thấy duy nhất vị trí kết quả SePay';
  end if;
  if (length(v_ddl) - length(replace(v_ddl, v_marker_paid, ''))) / length(v_marker_paid) <> 1 then
    raise exception 'Không tìm thấy duy nhất vị trí ghi nhận tiền SePay';
  end if;
  execute replace(replace(replace(v_ddl, v_marker, v_insert || v_marker), v_marker_paid,
    '  update public.orders set payment_status = ''paid'', payment_acceptance = ''accepted'', updated_at = now() where id = v_order.id;'),
    v_marker_result, '  return jsonb_build_object(''success'', true, ''matched'', true, ''order_code'', v_order.code);');
end $patch$;

-- Cho khách tra cứu trạng thái thanh toán bằng mã đơn + SĐT đã nhập.
create or replace function public.lookup_order(p_code text, p_phone text)
returns jsonb language plpgsql stable security definer set search_path = ''
as $$
declare o public.orders; v_phone text := private.normalize_phone(p_phone);
begin
  if v_phone is null or v_phone = '0000000000' then return null; end if;
  select * into o from public.orders where code = upper(btrim(p_code)) and phone = v_phone;
  if not found then return null; end if;
  return jsonb_build_object(
    'code', o.code, 'status', o.status, 'delivery', o.delivery, 'subtotal', o.subtotal,
    'shipping_fee', o.shipping_fee, 'tracking_code', o.tracking_code, 'created_at', o.created_at,
    'payment_method', o.payment_method, 'payment_status', o.payment_status,
    'payment_acceptance', o.payment_acceptance,
    'payment_hold_until', o.payment_hold_until, 'payment_auto_until', o.payment_auto_until,
    'items', (select jsonb_agg(jsonb_build_object('name', name, 'qty', qty, 'unit_price', unit_price) order by id)
              from public.order_items where order_id = o.id));
end $$;

-- Chủ shop đối chiếu giao dịch thiếu mã hoặc đến muộn theo mã giao dịch thật.
-- Không ghép chỉ vì số tiền trùng: phải chọn đúng đơn và xác nhận thủ công.
create function public.sepay_resolve_review(p_transaction_id bigint, p_order_code text)
returns void language plpgsql security definer set search_path = ''
as $$
declare v_payment public.sepay_transactions; v_order public.orders; v_bank_account text;
begin
  if not private.is_owner() then
    raise exception 'Chỉ chủ shop được xác minh giao dịch thủ công.' using errcode = '42501';
  end if;
  if p_order_code is null or upper(btrim(p_order_code)) !~ '^TTT[0-9]{6}$' then
    raise exception 'Mã đơn không hợp lệ.' using errcode = '22023';
  end if;
  select * into v_payment from public.sepay_transactions where id = p_transaction_id for update;
  if not found or v_payment.status <> 'review' or v_payment.transfer_type <> 'in' then
    raise exception 'Giao dịch không còn ở trạng thái cần kiểm tra.' using errcode = '22023';
  end if;
  select * into v_order from public.orders where code = upper(btrim(p_order_code)) for update;
  if not found or v_order.payment_method <> 'bank' or v_order.status = 'cancelled'
     or (v_order.payment_status = 'paid' and v_order.payment_acceptance is distinct from 'review'
         and v_order.payment_auto_until is not null) then
    raise exception 'Đơn không còn cần đối chiếu chuyển khoản.' using errcode = '22023';
  end if;
  if exists (select 1 from public.sepay_transactions
             where order_id = v_order.id and status = 'matched' and id <> v_payment.id) then
    raise exception 'Đơn đã được ghép với giao dịch SePay khác.' using errcode = '22023';
  end if;
  if v_order.payment_auto_until is not null and v_order.payment_status = 'paid'
     and exists (select 1 from public.sepay_transactions
                 where order_id = v_order.id and status = 'review'
                   and review_reason in ('Quá 24 giờ; shop cần xác minh thủ công',
                                         'Hết thời gian giữ hàng và không còn đủ hàng; shop cần xử lý'))
     and (v_payment.order_id is distinct from v_order.id
          or v_payment.review_reason not in ('Quá 24 giờ; shop cần xác minh thủ công',
                                              'Hết thời gian giữ hàng và không còn đủ hàng; shop cần xử lý')) then
    raise exception 'Giao dịch này không phải khoản tiền đang chờ xử lý của đơn.' using errcode = '22023';
  end if;
  select bank->>'account_no' into v_bank_account from public.settings where id = 1;
  if v_payment.account_number is distinct from v_bank_account
     or v_payment.transfer_amount <> v_order.subtotal + coalesce(v_order.shipping_fee, 0)
     or v_order.shipping_fee is null
     or (v_payment.payment_code is not null and v_payment.payment_code <> v_order.code)
     or (v_payment.order_id is not null and v_payment.order_id <> v_order.id) then
    raise exception 'Tài khoản, số tiền hoặc mã đơn không khớp; không thể tự gắn giao dịch.' using errcode = '22023';
  end if;
  if v_order.payment_auto_until is null then
    if v_order.payment_status <> 'paid' then
      raise exception 'Đơn cũ chưa được xác nhận tiền; hãy kiểm tra đơn trước.' using errcode = '22023';
    end if;
    update public.sepay_transactions set order_id = v_order.id, payment_code = v_order.code,
      status = 'matched', review_reason = null where id = v_payment.id;
    insert into public.order_events(order_id, type, note, created_by)
    values (v_order.id, 'payment_linked', 'Chủ shop gắn giao dịch SePay cũ · ' || v_payment.transaction_id, (select auth.uid()));
    return;
  end if;
  if not private.reserve_bank_order(v_order.id, null) then
    raise exception 'Không còn đủ hàng; vui lòng xử lý tồn kho hoặc hoàn tiền trước.' using errcode = '22023';
  end if;
  update public.orders set payment_status = 'paid', payment_acceptance = 'accepted',
    needs_restock = false, updated_at = now() where id = v_order.id;
  update public.sepay_transactions set order_id = v_order.id, payment_code = v_order.code,
    status = 'matched', review_reason = null where id = v_payment.id;
  insert into public.order_events(order_id, type, note, created_by)
  values (v_order.id, case when v_order.payment_status = 'paid' then 'payment_accepted' else 'paid' end,
    'Chủ shop đối chiếu SePay · giao dịch ' || v_payment.transaction_id, (select auth.uid()));
end $$;
revoke all on function public.sepay_resolve_review(bigint, text) from public, anon;
grant execute on function public.sepay_resolve_review(bigint, text) to authenticated;

commit;
