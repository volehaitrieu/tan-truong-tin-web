-- Tài khoản khách (đợt 4): cho tài khoản đăng nhập bằng Google/Facebook tạo hồ sơ khách.
-- Tài khoản SĐT (email ảo @khach.tantruongtin.vn): SĐT vẫn lấy từ email đăng nhập như cũ, bỏ qua p_phone.
-- Tài khoản Google/Facebook: không có SĐT → khách tự nhập (không xác minh, không trùng — giống đăng ký thường).
-- Nhân viên vẫn bị từ chối.

drop function if exists public.customer_register(text, text);

create or replace function public.customer_register(p_full_name text, p_email text, p_phone text default null)
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
  if v_login ~ '@khach\.tantruongtin\.vn$' then
    if v_login !~ '^0[0-9]{9}@khach\.tantruongtin\.vn$' then
      raise exception 'Tài khoản không phải tài khoản khách.' using errcode = '42501';
    end if;
    v_phone := split_part(v_login, '@', 1);
  else
    v_phone := btrim(coalesce(p_phone, ''));
    if v_phone !~ '^0[0-9]{9}$' then
      raise exception 'Số điện thoại cần 10 số, bắt đầu bằng 0.' using errcode = '22023';
    end if;
    -- SĐT đã là tên đăng nhập của một tài khoản SĐT khác
    if exists (select 1 from auth.users where email = v_phone || '@khach.tantruongtin.vn') then
      raise exception 'duplicate phone login' using errcode = '23505';
    end if;
  end if;
  insert into public.customers (id, full_name, phone, email)
  values (v_uid, p_full_name, v_phone, p_email);
end $$;
revoke all on function public.customer_register(text, text, text) from public, anon;
grant execute on function public.customer_register(text, text, text) to authenticated;
