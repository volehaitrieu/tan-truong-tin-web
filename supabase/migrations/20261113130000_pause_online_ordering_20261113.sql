-- Tạm ngưng đặt hàng trực tuyến (13/11/2026, chủ shop chọn) cho tới khi thông báo website với Bộ Công Thương.
-- Khách vãng lai và khách đăng nhập không gọi được place_order (kể cả gọi thẳng API, không qua web).
-- Không xóa hàm, không đổi dữ liệu. Bán tại quầy trong quản trị không dùng hàm này.
--
-- MỞ LẠI (khi đã được phép bán trực tuyến):
--   grant execute on function public.place_order(jsonb) to anon, authenticated;
--   và đặt NEXT_PUBLIC_ORDERING_OPEN=1 trong Vercel rồi phát hành lại.
revoke execute on function public.place_order(jsonb) from public, anon, authenticated;
