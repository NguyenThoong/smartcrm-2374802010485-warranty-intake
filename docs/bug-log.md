## BUG-001: Lỗi không tìm thấy script chạy test
1. Mã và mức độ: BUG-001 Minor
2. Phát hiện bởi: Quá trình khởi chạy Unit Test bằng Jest tại Buổi 10.
3. Triệu chứng: Gõ lệnh `npm test` trên terminal backend báo lỗi `npm error Missing script: "test"`.
4. Cách tái lập: Mở terminal tại `src/backend` và gõ `npm test`.
5. Nguyên nhân: File `package.json` mặc định của backend chưa định nghĩa lệnh gọi thư viện Jest trong khối scripts.
6. Cách sửa: Thêm dòng `"test": "jest"` vào khối `"scripts"` trong `package.json`.
## BUG-002: Lỗi vi phạm ràng buộc trạng thái (ticket_status_check) khi tạo phiếu
1. Mã và mức độ: BUG-002 Major
2. Phát hiện bởi: Quá trình tích hợp và test chức năng Tạo phiếu bảo hành từ Frontend.
3. Triệu chứng: Giao diện hiển thị lỗi đỏ `Lỗi: new row for relation "ticket" violates check constraint "ticket_status_check"`. Phiếu mới bị từ chối, không lưu vào cơ sở dữ liệu.
4. Cách tái lập: Truy cập giao diện `/tiep-nhan`, điền đầy đủ thông tin biểu mẫu và bấm "Tạo phiếu".
5. Nguyên nhân: Tầng Backend truyền trường `status` không khớp với ràng buộc `CHECK` của PostgreSQL. Database chỉ chấp nhận `'TIEP_NHAN'` theo DDL, nhưng Backend lại gửi giá trị khác (ví dụ: `'NEW'` hoặc `'MỚI'`).
6. Cách sửa: Mở file `ticketService.js`, tìm hàm `createNewTicket` và cập nhật giá trị thuộc tính `status` thành `'TIEP_NHAN'`.