-- ĐÃ ÁP DỤNG 09/11/2026 theo duyệt của chủ shop. DB thật: ztbwxfzklznpqbofbwlk.
-- Chỉ sửa cách tính phí trong public.place_order; không đổi bảng/đơn cũ/RLS/quyền.
-- Đã đối chiếu chỉ đọc: hash hiện tại 7252ed48917f9e98d1a44e287f46f052, chính sách flat_15000_v1.
-- Phí server: pickup 0đ; giao hàng 15.000đ nếu tiền hàng <500.000đ;
-- từ 500.000đ trở lên 0đ. Tiền hàng lấy từ giá sản phẩm trong DB.
BEGIN;
DO $patch$
DECLARE
  v_definition text;
  v_marker text := 'UPDATE public.orders SET subtotal=v_subtotal,shipping_fee=v_fee,needs_restock=v_restock WHERE id=v_order_id;';
  v_replacement text := 'v_fee := CASE WHEN v_delivery=''pickup'' THEN 0 WHEN v_subtotal >= 500000 THEN 0 ELSE 15000 END; UPDATE public.orders SET subtotal=v_subtotal,shipping_fee=v_fee,needs_restock=v_restock WHERE id=v_order_id;';
BEGIN
  v_definition := pg_get_functiondef('public.place_order(jsonb)'::regprocedure);
  IF md5(replace(v_definition, E'\r\n', E'\n')) <> '7252ed48917f9e98d1a44e287f46f052' THEN
    RAISE EXCEPTION 'place_order đã thay đổi; dừng để đối chiếu lại';
  END IF;
  IF position('flat_15000_v1' in v_definition) = 0 THEN
    RAISE EXCEPTION 'Chính sách giao hàng không còn khớp; dừng để đối chiếu lại';
  END IF;
  IF (length(v_definition) - length(replace(v_definition, v_marker, ''))) / length(v_marker) <> 1 THEN
    RAISE EXCEPTION 'Không tìm thấy đúng một vị trí tính phí; dừng để đối chiếu lại';
  END IF;
  v_definition := replace(v_definition, v_marker, v_replacement);
  EXECUTE v_definition;
END $patch$;
COMMIT;
