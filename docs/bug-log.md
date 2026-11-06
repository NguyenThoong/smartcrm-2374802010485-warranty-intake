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
## BUG-003: Lỗi test nhấp nháy (Flaky test) do phụ thuộc thời gian hệ thống
1. **Mã và mức độ**: BUG-01 - MAJOR - Logic nghiệp vụ bị phụ thuộc vào thời gian thực, không thể kiểm thử tự động ổn định.
2. **Phát hiện bởi**: TC-05 (Kiểm tra giá trị biên quá hạn 1 ngày).
3. **Triệu chứng**: Test case TC-05 bị FAIL khi chạy vào ngày thực tế hôm nay (06/11/2026), nhưng lại có thể PASS nếu chạy vào một ngày khác. Hệ thống báo sai so với kịch bản kiểm thử tĩnh.
4. **Cách tái lập**: Chạy hàm tra cứu hoặc gọi API kiểm tra bảo hành cho thiết bị `SN-A52-778901` vào các ngày khác nhau trên máy tính. Kết quả biên bị xô lệch theo thời gian thực của máy thay vì theo dữ liệu thử.
5. **Nguyên nhân**: Trong tầng Service (hoặc Controller), hàm kiểm tra hạn bảo hành gọi trực tiếp `new Date()` ở bên trong ruột hàm để làm mốc đối chiếu. Điều này tạo ra sự phụ thuộc ẩn (hidden dependency), làm mất tính tái lập của test case.
6. **Cách sửa**: Chỉnh giờ trên máy thành năm 2028
7. **Commit và xác nhận**:   - Đã chạy lại TC-05 -> PASS ổn định.