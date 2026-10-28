# Mẫu schema ecommerce cho Supabase

Đây là điểm xuất phát, **không áp dụng nguyên xi**: chọn bảng theo mức MVP người dùng đã chốt, giải thích từng bảng bằng ví dụ shop của họ, và hỏi trước khi chạy migration.

## Mức độ
- **Tối giản (A):** `products`, `orders`, `order_items`, `profiles`
- **Chuẩn (B):** + `categories`, `product_variants`, `addresses`
- **Đầy đủ (C):** + `inventory_movements`, `coupons`, `reviews`

## SQL mẫu (mức Chuẩn)

```sql
-- Hồ sơ người dùng + vai trò
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','staff','admin')),
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  sort_order int default 0
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  images text[] default '{}',          -- đường dẫn trong Supabase Storage
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text unique,
  name text not null,                  -- ví dụ "Size M / Đen"
  price integer not null check (price >= 0),          -- VND, lưu số nguyên
  compare_at_price integer check (compare_at_price >= 0),
  stock integer not null default 0 check (stock >= 0)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,           -- mã đơn hiển thị, ví dụ DH240001
  user_id uuid references auth.users(id), -- null nếu khách vãng lai
  customer_name text not null,
  customer_phone text not null,
  shipping_address jsonb not null,     -- {province, district, ward, street}
  note text,
  subtotal integer not null,
  shipping_fee integer not null default 0,
  discount integer not null default 0,
  total integer not null,
  payment_method text not null check (payment_method in ('cod','bank_transfer','payos','vnpay','momo')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','paid','refunded')),
  status text not null default 'pending' check (status in ('pending','confirmed','shipping','completed','cancelled')),
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid references public.product_variants(id),
  product_name text not null,          -- chụp lại tên/giá tại thời điểm mua
  variant_name text,
  unit_price integer not null,
  quantity integer not null check (quantity > 0)
);
```

## RLS

```sql
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Hàm kiểm tra admin/staff (security definer để tránh đệ quy RLS)
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','staff'));
$$;

-- Ai cũng xem được danh mục & sản phẩm đang bán
create policy "public read categories" on public.categories for select using (true);
create policy "public read active products" on public.products for select using (is_active or public.is_staff());
create policy "public read variants" on public.product_variants for select using (true);

-- Chỉ staff được thêm/sửa/xóa catalog
create policy "staff write products" on public.products for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write variants" on public.product_variants for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write categories" on public.categories for all using (public.is_staff()) with check (public.is_staff());

-- Profiles: mỗi người xem/sửa hồ sơ của mình (không tự đổi role — xử lý bằng cột riêng hoặc trigger)
create policy "own profile read" on public.profiles for select using (id = auth.uid() or public.is_staff());
create policy "own profile update" on public.profiles for update using (id = auth.uid());

-- Đơn hàng: khách đăng nhập xem đơn của mình; staff xem tất cả.
create policy "own orders read" on public.orders for select using (user_id = auth.uid() or public.is_staff());
create policy "staff update orders" on public.orders for update using (public.is_staff());
create policy "own order items read" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_staff())));
```

## Điểm cần giải thích cho người dùng
- **Tạo đơn không làm trực tiếp từ trình duyệt.** Dùng Server Action/Route Handler (hoặc hàm Postgres `create_order` dạng `security definer`) để: đọc giá thật từ DB, kiểm tra tồn kho, trừ kho, tính tổng, rồi insert — tất cả trong một transaction. Vì thế không có policy `insert` công khai cho `orders`.
- **Tra cứu đơn cho khách vãng lai**: làm ở server bằng mã đơn + số điện thoại, không mở RLS cho đọc công khai.
- **Chặn tự nâng quyền**: policy "own profile update" phải không cho sửa `role` — thêm trigger từ chối thay đổi `role` nếu người sửa không phải admin, hoặc tách role sang bảng riêng.
- **Tiền lưu số nguyên VND** để tránh lỗi làm tròn.
- **Storage**: bucket `product-images` public read, chỉ staff upload.
- Sau migration chạy Supabase `get_advisors` (security) và sửa hết cảnh báo.
- Khóa `service_role` chỉ dùng phía server; không prefix `NEXT_PUBLIC_`.
