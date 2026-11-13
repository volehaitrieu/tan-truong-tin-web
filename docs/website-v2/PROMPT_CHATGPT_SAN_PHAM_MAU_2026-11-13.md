# Lời nhắn dán vào ChatGPT — thu thập sản phẩm mẫu

Sao chép toàn bộ phần trong khung dưới đây, dán vào ChatGPT (bật tìm kiếm web).

```
Bạn hãy tra internet và thu thập dữ liệu 24 sản phẩm có bán thật tại Việt Nam cho một cửa hàng điện máy - gia dụng ở Nha Trang.
Mỗi loại 3 sản phẩm, ưu tiên thương hiệu phổ biến, mỗi sản phẩm một mẫu cụ thể (có mã model):

Ngành "Đồ công nghệ": Bàn phím, Chuột, Sạc dự phòng, USB, Lót chuột
Ngành "Đồ dùng nhà bếp": Dao, Kéo, Thớt

Yêu cầu:
- Chỉ dùng thông tin có trên trang chính thức của hãng hoặc nhà bán lớn (Thế Giới Di Động, Điện Máy Xanh, FPT Shop, CellphoneS, Shopee Mall, Lazada Mall). Ghi link nguồn cho từng sản phẩm.
- Không tự bịa thông số. Thông số nào không tìm thấy thì để trống.
- Giá: giá bán lẻ tham khảo hiện tại bằng VND (số nguyên, không dấu chấm).
- Ảnh: 1–3 link ảnh trực tiếp (kết thúc .jpg/.png/.webp), mở được không cần đăng nhập.
- Mô tả: 2–3 câu tiếng Việt do bạn tự viết, không sao chép nguyên văn.

Trả kết quả DUY NHẤT dưới dạng một khối JSON hợp lệ (không chú thích ngoài khối), theo đúng mẫu:

[
  {
    "nganh": "Đồ công nghệ",
    "loai": "Bàn phím",
    "ten": "Bàn phím cơ không dây Logitech G515 Lightspeed TKL",
    "thuong_hieu": "Logitech",
    "model": "G515",
    "gia": 2490000,
    "don_vi": "cái",
    "thong_so": { "Kết nối": "Lightspeed, Bluetooth", "Bố cục": "TKL", "Pin": "..." },
    "bao_hanh": "24 tháng",
    "xuat_xu": "Trung Quốc",
    "mo_ta": "…",
    "huong_dan": "…",
    "anh": ["https://…jpg"],
    "nguon": ["https://…"]
  }
]
```

Sau khi ChatGPT trả lời: bấm sao chép khối JSON, dán vào một tệp mới tên `san-pham-mau.json` trong thư mục **Tải xuống** (Notepad → Lưu thành → chọn "All files", mã hóa UTF-8). Rồi nhắn Claude.
