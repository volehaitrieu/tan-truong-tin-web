-- Tài khoản khách hàng (đợt 1): hồ sơ khách, kiểm trùng SĐT/email, tạo hồ sơ sau khi đăng ký.
-- Đăng nhập dùng Supabase Auth với email ảo {sđt}@khach.tantruongtin.vn (khác miền nhân viên).
-- Khách KHÔNG có quyền nhân viên: mọi quyền quản trị vẫn kiểm qua public.profiles (không đổi).

create table public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(btrim(full_name)) between 2 and 80),
  phone text not null unique check (phone ~ '^0[0-9]{9}$'),
  email text check (email is null or (char_length(email) <= 120 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Email không trùng, không phân biệt hoa thường
create unique index customers_email_lower_key on public.customers (lower(email)) where email is not null;

alter table public.customers enable row level security;

-- Khách chỉ xem và sửa hồ sơ của chính mình; chỉ sửa được họ tên và email (SĐT là tên đăng nhập)
create policy customers_select_own on public.customers for select to authenticated
  using (id = (select auth.uid()));
create policy customers_update_own on public.customers for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

revoke all on public.customers from anon, authenticated;
grant select on public.customers to authenticated;
grant update (full_name, email) on public.customers to authenticated;

create or replace function private.customers_touch() returns trigger
language plpgsql set search_path to '' as $$
begin
  new.updated_at := now();
  new.email := nullif(lower(btrim(new.email)), '');
  new.full_name := btrim(new.full_name);
  return new;
end $$;
create trigger customers_touch before insert or update on public.customers
  for each row execute function private.customers_touch();

-- Kiểm trùng trước khi đăng ký để báo lỗi dưới đúng ô. Chỉ trả đúng/sai, không trả dữ liệu khách.
create or replace function public.customer_identifiers_taken(p_phone text, p_email text)
returns table (phone_taken boolean, email_taken boolean)
language sql stable security definer set search_path to '' as $$
  select
    exists (select 1 from public.customers where phone = p_phone)
      or exists (select 1 from auth.users where email = p_phone || '@khach.tantruongtin.vn'),
    coalesce(nullif(btrim(p_email), '') is not null
      and exists (select 1 from public.customers where lower(email) = lower(btrim(p_email))), false);
$$;
revoke all on function public.customer_identifiers_taken(text, text) from public;
grant execute on function public.customer_identifiers_taken(text, text) to anon, authenticated;

-- Tạo hồ sơ cho tài khoản vừa đăng ký. SĐT lấy từ email đăng nhập (không tin số trình duyệt gửi lên).
create or replace function public.customer_register(p_full_name text, p_email text)
returns void
language plpgsql security definer set search_path to '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_login text := (select email from auth.users where id = (select auth.uid()));
  v_phone text;
begin
  if v_uid is null then
    raise exception 'Bạn cần đăng nhập.' using errcode = '42501';
  end if;
  if exists (select 1 from public.profiles where id = v_uid) then
    raise exception 'Tài khoản nhân viên không tạo hồ sơ khách.' using errcode = '42501';
  end if;
  if v_login !~ '^0[0-9]{9}@khach\.tantruongtin\.vn$' then
    raise exception 'Tài khoản không phải tài khoản khách.' using errcode = '42501';
  end if;
  v_phone := split_part(v_login, '@', 1);
  insert into public.customers (id, full_name, phone, email)
  values (v_uid, p_full_name, v_phone, p_email);
end $$;
revoke all on function public.customer_register(text, text) from public, anon;
grant execute on function public.customer_register(text, text) to authenticated;
