# Progress — Tân Trường Tín

**Giai đoạn hiện tại:** 3. Thiết kế (Admin ✅, Bán hàng chờ duyệt) → Sprint 0/1
**Mốc (DEV_PLAN v1.2):** Đợt 1 = **Admin chạy thật** ~7/11 · Đợt 2 = **Trang bán hàng** nhận đơn ~20/11.
**Ký hiệu:** ⬜ chưa · 🔄 đang · ✅ xong · 🟡 lỗi nhỏ · 🔴 hỏng · ⏸️ để sau

## Giai đoạn 0-3: Ý tưởng, MVP, tài liệu, thiết kế
| Task | Trạng thái | Ngày | Ghi chú |
|---|---|---|---|
| Idea Brief | ✅ | 2026-10-20 | `docs/IDEA_BRIEF.md` |
| Khảo sát dữ liệu Excel (DMHH, file quạt) | ✅ | 2026-10-20 | 3.575 mã + ~183 mã quạt |
| Chọn MVP (phương án A) | ✅ | 2026-10-20 | Ảnh minh họa cho toàn bộ SP (sửa 2026-10-21) |
| PRD | ✅ | 2026-10-21 | v1.0 + cập nhật ship/phân quyền |
| Mẫu trang chủ | ✅ | 2026-10-21 | v3, `mockup/trang-chu.html` |
| DESIGN.md | ✅ | 2026-10-21 | v1.0 |
| Chốt phân quyền | ✅ | 2026-10-21 | NV kho chỉ xem; NV đơn không hủy/không giảm giá |
| Chốt phí ship | 🟡 | 2026-10-21 | Đi tỉnh: báo sau. Nội thành + freeship: ⏸️ để sau |
| DEV_PLAN.md | ✅ | 2026-10-21 | v1.2: Admin trước, bán hàng sau |
| Canvas thiết kế Admin (15 màn + 2 điện thoại) | ✅ | 2026-10-21 | Đã duyệt |
| Canvas thiết kế Bán hàng (8 màn máy tính + 9 điện thoại) | 🔄 | 2026-10-21 | Chờ chủ shop duyệt |
| Logo chính thức | ✅ | 2026-10-21 | PNG trong suốt từ logo.png gốc (`docs/brand/`). Vector in khổ lớn: chưa có |
| Thông tin liên hệ thật | ⬜ | | Số nhà, SĐT, Zalo, giờ mở cửa |

## Sprint 0 — Chuẩn bị (21-22/10)
| Task | Trạng thái | Ngày | Ghi chú |
|---|---|---|---|
| 0.1 Tài khoản & công cụ | 🔄 | 2026-10-21 | ✅ Node 24, npm 11, Git 2.55, Supabase CLI 2.115, GitHub · ✅ Supabase project mới `tan-truong-tin-web` (Singapore) · ⬜ Vercel |

## Sprint 1 — Nền, database, đăng nhập (22-27/10)
| Task | Trạng thái | Ngày | Ghi chú |
|---|---|---|---|
| 1.1 Dựng dự án + giao diện nền | ⬜ | | |
| 1.2 Kết nối Supabase | ⬜ | | |
| 1.3 Database + RLS | ⬜ | | |
| 1.4 Đăng nhập admin + phân quyền | ⬜ | | Đợt 1: 3 vai trò cố định |
| 1.5 Phân loại & nạp dữ liệu (Mentor) | ⬜ | | Đợt 1 |
| Bổ sung cột Tồn kho + Tồn tối thiểu vào Excel (chủ shop) | ⬜ | | Trước Task 2.3 |

## Sprint 2 — Admin sản phẩm, Excel, tồn kho (28/10-3/11)
| Task | Trạng thái | Ngày | Ghi chú |
|---|---|---|---|
| 2.1 Danh sách SP (admin) | ⬜ | | |
| 2.2 Form SP + thông số + giá KM | ⬜ | | |
| 2.3 Nhập Excel | ⬜ | | |
| 2.4 AI gợi ý danh mục & thương hiệu | ⏸️ | 2026-10-21 | Bỏ, thay bằng 1.5 |
| 2.5 Ảnh SP + ảnh minh họa | ⬜ | | |
| 2.6 Tồn kho | ⬜ | | |
| 2.7 Nhân viên & bảng quyền | ⬜ | | |
| 2.8 Danh mục & thương hiệu | ⬜ | | |
| 2.9 Ảnh thông tin SP gửi khách | ⬜ | | Mới, Đợt 1 |
| 2.10 Đợt kiểm kho + đếm điện thoại | ⬜ | | Mới, Đợt 1 |

## Sprint 3 — Storefront (4-10/11)
| Task | Trạng thái | Ngày | Ghi chú |
|---|---|---|---|
| 3.1 Trang chủ | ⬜ | | |
| 3.2 Danh mục, tìm kiếm, bộ lọc | ⬜ | | |
| 3.3 Chi tiết SP | ⬜ | | |
| 3.4 Giỏ hàng | ⬜ | | |
| 3.5 Checkout + tạo đơn | ⬜ | | |
| 3.6 Cảm ơn, tra cứu đơn, VietQR | ⬜ | | |
| 3.7 Chính sách, giới thiệu, SEO | ⬜ | | |
| 3.8 Báo giá số lượng lớn | ⬜ | | Đợt 1 |

## Sprint 4 — Đơn hàng, thông báo, kiểm thử, đưa lên mạng (11-17/11)
| Task | Trạng thái | Ngày | Ghi chú |
|---|---|---|---|
| 4.0 Admin tối thiểu | ⬜ | | Đợt 1 |
| 4.1 Quản lý đơn hàng (phần còn lại) | ⬜ | | Đợt 2 |
| 4.2 In phiếu | ⬜ | | |
| 4.3 Telegram báo đơn | ⬜ | | |
| 4.4 Cài đặt cửa hàng | ⬜ | | |
| 4.5 Kiểm thử & bảo mật | ⬜ | | |
| 4.6 Đưa lên mạng | ⬜ | | |
| Mở bán thử (18-20/11) | ⬜ | | |
