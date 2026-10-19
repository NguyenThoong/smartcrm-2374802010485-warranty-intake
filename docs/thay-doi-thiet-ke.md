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