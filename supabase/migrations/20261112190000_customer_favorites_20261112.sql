-- Tài khoản khách (đợt 3): sản phẩm yêu thích theo tài khoản.
-- Mỗi khách chỉ xem/thêm/xóa yêu thích của chính mình. Tối đa 200 sản phẩm mỗi khách.

create table public.customer_favorites (
  customer_id uuid not null references public.customers(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (customer_id, product_id)
);
create index customer_favorites_product_idx on public.customer_favorites (product_id);

alter table public.customer_favorites enable row level security;

create policy customer_favorites_select_own on public.customer_favorites for select to authenticated
  using (customer_id = (select auth.uid()));
create policy customer_favorites_insert_own on public.customer_favorites for insert to authenticated
  with check (customer_id = (select auth.uid()));
create policy customer_favorites_delete_own on public.customer_favorites for delete to authenticated
  using (customer_id = (select auth.uid()));

revoke all on public.customer_favorites from anon, authenticated;
grant select, insert, delete on public.customer_favorites to authenticated;

-- Chặn danh sách phình vô hạn
create or replace function private.customer_favorites_limit() returns trigger
language plpgsql set search_path to '' as $$
begin
  if (select count(*) from public.customer_favorites where customer_id = new.customer_id) >= 200 then
    raise exception 'Danh sách yêu thích tối đa 200 sản phẩm.' using errcode = '22023';
  end if;
  return new;
end $$;
create trigger customer_favorites_limit before insert on public.customer_favorites
  for each row execute function private.customer_favorites_limit();
