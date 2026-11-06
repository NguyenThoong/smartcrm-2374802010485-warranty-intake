# Nhật ký thay đổi thiết kế
## Sau phản hồi Bài tập 1 (buổi 8, ngày 19/10/2026)

### TD-01: Đồng bộ Sơ đồ Kiến trúc và Đặc tả
- Phản hồi của GV: Sơ đồ vẽ 3 lớp nhưng văn bản mô tả 4 lớp với Controller và Service khác tên.
- Quyết định: SỬA.
- Lý do: Đảm bảo tính nhất quán giữa bản vẽ và đặc tả kỹ thuật.
- Ảnh hưởng: Cập nhật lại hình `Architecture.drawio` thành 4 lớp rõ ràng (Presentation, Controller, Business, Data Access), đổi tên Service khớp với văn bản.

### TD-02: Điều chỉnh Lập luận Kiến trúc NFR
- Phản hồi của GV: Lập luận 3 dùng NFR3 (Uptime 99,9%) để biện minh cho RBAC là không liên quan.
- Quyết định: SỬA.
- Lý do: RBAC là cơ chế bảo mật (Security), không phải tính sẵn sàng (Availability).
- Ảnh hưởng: Đã bổ sung NFR4 về Phân quyền/Bảo mật vào bản SRS và viết lại Lập luận 3 dựa trên NFR4.

## Sau phản hồi Bài tập 2 (buổi 14, ngày 06/11/2026)
## Quyết định xử lý phản hồi Bài tập 2 (Cập nhật Buổi 14)

| Phản hồi của giảng viên (BT2) | Quyết định xử lý & Hành động thực tế | Ghi chú |
| :--- | :--- | :--- |
| **Chưa đủ CRUD 2 thực thể.** | **Đã khắc phục:** Đã bổ sung và hoàn thiện toàn bộ các endpoint API (GET, POST, PUT, DELETE) cho thực thể thứ 2 (Khách hàng/Thiết bị), đảm bảo logic liên kết đúng với thực thể Ticket. | Đã đẩy code lên nhánh `main`. |
| **Chưa thấy ảnh trạng thái lỗi kết nối có nút "Thử lại".** | **Đã khắc phục:** Đã cập nhật component lỗi (ErrorState) ở Frontend, bổ sung nút "Thử lại" để tự động gọi lại API khi mất kết nối mạng. | Sẽ được ghi nhận chi tiết thành 1 mục trong **Bug Log** (BT3). |