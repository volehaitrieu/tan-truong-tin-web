-- Dữ liệu ban đầu: quyền, danh mục, thương hiệu, cài đặt, sản phẩm mẫu (chạy lại được)

insert into public.permissions (key, label, sort) values
  ('view_cost', 'Xem giá nhập', 1), ('edit_products', 'Sửa sản phẩm', 2), ('edit_price', 'Sửa giá bán', 3),
  ('adjust_stock', 'Điều chỉnh tồn kho', 4), ('count_stock', 'Đếm kiểm kho', 5), ('import_excel', 'Nhập Excel', 6),
  ('process_orders', 'Xử lý đơn hàng', 7), ('cancel_orders', 'Hủy đơn', 8), ('discount_orders', 'Giảm giá trong đơn', 9),
  ('pos_sale', 'Bán tại quầy', 10), ('view_reports', 'Xem báo cáo', 11), ('view_profit', 'Xem lãi gộp', 12),
  ('manage_staff', 'Quản lý nhân viên', 13), ('settings', 'Cài đặt', 14), ('view_audit', 'Xem nhật ký thao tác', 15)
on conflict (key) do update set label = excluded.label, sort = excluded.sort;

-- Mặc định theo PRD: NV kho xem (kể cả giá nhập) + đếm; NV đơn xử lý đơn + bán tại quầy.
insert into public.role_permissions (role, permission, allowed)
select r.role, p.key,
  case when r.role = 'owner' then true
       when r.role = 'stock_staff' then p.key in ('view_cost', 'count_stock')
       when r.role = 'order_staff' then p.key in ('process_orders', 'pos_sale')
  end
from public.permissions p cross join (values ('owner'::public.app_role), ('order_staff'), ('stock_staff')) r(role)
on conflict (role, permission) do nothing;

insert into public.settings (id, shop, inner_ship_fee, free_ship_threshold, return_policy)
values (1, jsonb_build_object(
  'name', 'TÂN TRƯỜNG TÍN', 'tagline', 'Điện nước · Kim khí · Dụng cụ · Quạt · Gia dụng',
  'address', '379 đường 2/4, phường Bắc Nha Trang, tỉnh Khánh Hòa',
  'phone', '0948 732 064', 'phone2', '0793 783 379', 'hours', '7:45 – 20:30'), null, null, null)
on conflict (id) do nothing;

insert into public.categories (name, slug, icon, sort) values
  ('Ống nước & phụ kiện', 'ong-nuoc', 'wrench', 1), ('Thiết bị điện', 'thiet-bi-dien', 'plug', 2),
  ('Dây & cáp điện', 'day-cap-dien', 'cable', 3), ('Đèn chiếu sáng', 'den', 'bulb', 4),
  ('Quạt', 'quat', 'fan', 5), ('Dụng cụ cầm tay', 'dung-cu', 'drill', 6),
  ('Kim khí & keo', 'kim-khi', 'bolt', 7), ('Gia dụng', 'gia-dung', 'home', 8)
on conflict (slug) do nothing;

insert into public.categories (parent_id, name, slug, sort)
select c.id, s.name, s.slug, s.sort
from (values
  ('ong-nuoc', 'Ống PVC', 'ong-pvc', 1), ('ong-nuoc', 'Van & co nối', 'van-co-noi', 2), ('ong-nuoc', 'Băng tan & keo', 'bang-tan-keo', 3),
  ('thiet-bi-dien', 'Công tắc', 'cong-tac', 1), ('thiet-bi-dien', 'Ổ cắm', 'o-cam', 2), ('thiet-bi-dien', 'CB & aptomat', 'cb-aptomat', 3),
  ('day-cap-dien', 'Dây đơn', 'day-don', 1), ('day-cap-dien', 'Dây đôi', 'day-doi', 2), ('day-cap-dien', 'Cáp điện', 'cap-dien', 3),
  ('den', 'Bóng LED', 'bong-led', 1), ('den', 'Đèn tuýp', 'den-tuyp', 2), ('den', 'Đèn ốp trần', 'den-op-tran', 3),
  ('quat', 'Quạt treo tường', 'quat-treo-tuong', 1), ('quat', 'Quạt đứng', 'quat-dung', 2), ('quat', 'Quạt trần', 'quat-tran', 3),
  ('dung-cu', 'Máy khoan', 'may-khoan', 1), ('dung-cu', 'Kìm & cờ lê', 'kim-co-le', 2), ('dung-cu', 'Tua vít', 'tua-vit', 3),
  ('kim-khi', 'Vít & bulông', 'vit-bulong', 1), ('kim-khi', 'Keo dán', 'keo-dan', 2), ('kim-khi', 'Băng keo', 'bang-keo', 3),
  ('gia-dung', 'Ấm & bình đun', 'am-binh-dun', 1), ('gia-dung', 'Đồ bếp', 'do-bep', 2), ('gia-dung', 'Dụng cụ vệ sinh', 've-sinh', 3)
) s(parent, name, slug, sort)
join public.categories c on c.slug = s.parent
on conflict (slug) do nothing;

update public.categories set attribute_schema = '[
  {"key":"loai","label":"Loại quạt","type":"select","options":["Treo tường","Đứng","Lửng","Trần"],"filter":true},
  {"key":"sai_canh","label":"Sải cánh","type":"number","unit":"cm","filter":true},
  {"key":"cong_suat","label":"Công suất","type":"number","unit":"W","filter":true},
  {"key":"so_canh","label":"Số cánh","type":"number"},
  {"key":"dieu_khien","label":"Điều khiển","type":"select","options":["Dây kéo","Nút bấm","Remote"],"filter":true},
  {"key":"dien_ap","label":"Điện áp","type":"text"}
]'::jsonb where slug = 'quat';

insert into public.brands (name, slug) values
  ('Bình Minh', 'binh-minh'), ('Tiền Phong', 'tien-phong'), ('Cadivi', 'cadivi'), ('Panasonic', 'panasonic'),
  ('Rạng Đông', 'rang-dong'), ('Hali', 'hali'), ('Senko', 'senko'), ('Asia', 'asia'), ('Makita', 'makita'),
  ('Bosch', 'bosch'), ('Tombo', 'tombo'), ('Miha', 'miha'), ('Midea', 'midea')
on conflict (name) do nothing;

-- Sản phẩm mẫu (sẽ thay bằng dữ liệu thật ở Task 1.5)
insert into public.products (sku, name, slug, unit, price, sale_price, sale_from, sale_to, category_id, brand_id, spec_line, attributes, warranty)
select v.sku, v.name, lower(v.sku), v.unit, v.price, v.sale, v.sfrom, v.sto,
       (select id from public.categories where slug = v.cat), (select id from public.brands where name = v.brand),
       v.spec, v.attrs::jsonb, v.warranty
from (values
  ('QUA-HALI-TR2', 'Quạt treo tường Hali TR2 (Ghi xám)', 'Cái', 480000, 430000, date '2026-10-22', date '2026-10-31', 'quat-treo-tuong', 'Hali', 'Sải cánh 40cm · 3 tốc độ', '{"loai":"Treo tường","sai_canh":40,"cong_suat":55,"so_canh":3,"dieu_khien":"Dây kéo","dien_ap":"220V"}', '12 tháng theo hãng'),
  ('ONG-BM-21-4M', 'Ống nhựa PVC Bình Minh Φ21 (cây 4m)', 'Cây', 32000, null, null, null, 'ong-pvc', 'Bình Minh', 'Φ21 · dài 4m', '{}', 'Đổi nếu lỗi nhà sản xuất'),
  ('DAY-CAD-225-100', 'Dây điện Cadivi 2x2.5 (cuộn 100m)', 'Cuộn', 1450000, null, null, null, 'day-doi', 'Cadivi', '2 lõi 2.5mm² · 100m', '{}', 'Theo hãng'),
  ('DEN-RD-LED-9W', 'Bóng LED Rạng Đông 9W', 'Bóng', 35000, null, null, null, 'bong-led', 'Rạng Đông', '9W · ánh sáng trắng · E27', '{}', '12 tháng theo hãng'),
  ('MAY-BOS-GSB550', 'Máy khoan Bosch GSB 550', 'Cái', 1150000, null, null, null, 'may-khoan', 'Bosch', '550W · khoan tường, gỗ, sắt', '{}', '6 tháng theo hãng'),
  ('BANG-TOMBO-10', 'Băng tan Tombo 10m', 'Cuộn', 8000, null, null, null, 'bang-tan-keo', 'Tombo', 'Dài 10m · quấn ren ống nước', '{}', 'Không áp dụng'),
  ('VAN-MIHA-21', 'Van bi đồng Miha Φ21', 'Cái', 95000, null, null, null, 'van-co-noi', 'Miha', 'Đồng thau · ren Φ21', '{}', '6 tháng'),
  ('BINH-MIDEA-18', 'Bình đun siêu tốc Midea 1.8L', 'Cái', 420000, 390000, date '2026-10-20', date '2026-11-05', 'am-binh-dun', 'Midea', '1.8 lít · 1500W', '{}', '12 tháng theo hãng')
) v(sku, name, unit, price, sale, sfrom, sto, cat, brand, spec, attrs, warranty)
on conflict (sku) do nothing;

insert into public.product_images (product_id, url, is_illustration)
select p.id, v.url, true from (values
  ('QUA-HALI-TR2', '/ai/fan.jpg'), ('ONG-BM-21-4M', '/ai/pvc-pipe.jpg'), ('DAY-CAD-225-100', '/ai/electrical-cable.jpg'),
  ('DEN-RD-LED-9W', '/ai/led-bulb.jpg'), ('MAY-BOS-GSB550', '/ai/cordless-drill.jpg'), ('BANG-TOMBO-10', '/ai/thread-seal-tape.jpg'),
  ('VAN-MIHA-21', '/ai/brass-valve.jpg'), ('BINH-MIDEA-18', '/ai/electric-kettle.jpg')
) v(sku, url) join public.products p on p.sku = v.sku
where not exists (select 1 from public.product_images i where i.product_id = p.id);

insert into public.product_costs (product_id, cost_price)
select p.id, v.cost from (values
  ('QUA-HALI-TR2', 355000), ('ONG-BM-21-4M', 24000), ('DAY-CAD-225-100', 1210000), ('DEN-RD-LED-9W', 26000),
  ('MAY-BOS-GSB550', 960000), ('BANG-TOMBO-10', 5000), ('VAN-MIHA-21', 72000), ('BINH-MIDEA-18', 310000)
) v(sku, cost) join public.products p on p.sku = v.sku
on conflict (product_id) do nothing;

update public.inventory i set qty = v.qty, min_qty = v.min
from (values ('QUA-HALI-TR2', 18, 4), ('ONG-BM-21-4M', 0, 12), ('DAY-CAD-225-100', 6, 3), ('DEN-RD-LED-9W', 42, 10),
             ('MAY-BOS-GSB550', 3, 2), ('BANG-TOMBO-10', 0, 10), ('VAN-MIHA-21', 15, 5), ('BINH-MIDEA-18', 7, 2)) v(sku, qty, min)
join public.products p on p.sku = v.sku
where i.product_id = p.id and i.qty = 0 and v.qty > 0;
update public.inventory i set min_qty = v.min
from (values ('ONG-BM-21-4M', 12), ('BANG-TOMBO-10', 10)) v(sku, min) join public.products p on p.sku = v.sku
where i.product_id = p.id;
