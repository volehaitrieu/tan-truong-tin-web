-- Chủ shop đánh dấu "Bỏ qua" cho tiền vào không phải của đơn hàng (ví dụ chuyển khoản cá nhân).
-- Chỉ áp dụng cho giao dịch tiền vào, đang "Cần kiểm tra" và chưa gắn đơn nào.
-- Không đổi đơn hàng, tiền hay tồn kho.
create or replace function public.sepay_ignore_review(p_transaction_id bigint)
returns void
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_payment public.sepay_transactions;
begin
  if not private.is_owner() then
    raise exception 'Chỉ chủ shop được bỏ qua giao dịch.' using errcode = '42501';
  end if;
  select * into v_payment from public.sepay_transactions where id = p_transaction_id for update;
  if not found or v_payment.status <> 'review' or v_payment.transfer_type <> 'in' then
    raise exception 'Giao dịch không còn ở trạng thái cần kiểm tra.' using errcode = '22023';
  end if;
  if v_payment.order_id is not null then
    raise exception 'Giao dịch đã gắn với một đơn; hãy xử lý tại đơn hàng.' using errcode = '22023';
  end if;
  update public.sepay_transactions
     set status = 'ignored',
         review_reason = 'Chủ shop bỏ qua: không phải tiền đơn hàng'
   where id = v_payment.id;
end
$function$;

revoke all on function public.sepay_ignore_review(bigint) from public, anon;
grant execute on function public.sepay_ignore_review(bigint) to authenticated;
