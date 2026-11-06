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
## BUG-04: CI Pipeline sập do thiếu tệp khóa phiên bản và sai thư mục gốc
1. **Mã và mức độ**: BUG-02 - MAJOR - Người khác clone về hoặc máy chủ CI không thể dựng và kiểm thử hệ thống tự động.
2. **Phát hiện bởi**: Luồng tự động GitHub Actions (Bước setup-node).
3. **Triệu chứng**: Chạy CI báo lỗi đỏ `Error: Dependencies lock file is not found...` và tiến trình bị hủy bỏ, không chạy được `npm test`.
4. **Cách tái lập**: Đẩy code lên GitHub để trigger CI, mở tab Actions kiểm tra log của pipeline sẽ thấy lỗi xuất hiện ngay trước lệnh `npm ci`.
5. **Nguyên nhân**: Repository chưa được commit file `package-lock.json` của backend. Đồng thời, do dự án dùng cấu trúc thư mục con (`src/backend`), file `ci.yml` chạy mặc định ở thư mục gốc nên không tìm thấy tệp khóa và mã nguồn.
6. **Cách sửa**: Khai báo biến `working-directory: ./src/backend` và `cache-dependency-path` trong file `.github/workflows/ci.yml`. Push bổ sung file `package-lock.json` vào nhánh main.
7. **Commit và xác nhận**: - Tab Actions trên GitHub đã báo tick xanh PASS toàn bộ cho luồng CI.
## BUG-05: Thiếu tính năng "Thử lại" khi giao diện gặp lỗi kết nối
1. **Mã và mức độ**: BUG-03 - MINOR - Ảnh hưởng đến trải nghiệm người dùng, nghiệp vụ backend vẫn hoạt động bình thường.
2. **Phát hiện bởi**: Giảng viên phản hồi khi chấm Bài tập 2.
3. **Triệu chứng**: Ở màn hình Danh sách phiếu (và các màn hình khác), khi máy chủ backend bị tắt hoặc mạng rớt, giao diện hiển thị thông báo lỗi nhưng người dùng không thể tự bấm tải lại mà phải F5 toàn bộ trang web.
4. **Cách tái lập**: Tắt terminal chạy server backend. Trên trình duyệt, truy cập vào giao diện tiếp nhận bảo hành và quan sát trạng thái lỗi.
5. **Nguyên nhân**: Component hiển thị trạng thái lỗi (`ErrorState.jsx` / `Error component`) chưa được thiết kế để nhận một callback function giúp trigger lại API fetch dữ liệu ban đầu.
6. **Cách sửa**: Bổ sung một nút "Thử lại" (Retry button) vào component báo lỗi. Truyền hàm gọi API (ví dụ: `fetchTickets`) vào sự kiện `onClick` của nút đó.
7. **Commit và xác nhận**: - Đã test tắt backend -> Hiện nút Thử lại (chụp ảnh TC-12) -> Bật lại backend và bấm nút -> Dữ liệu load thành công (PASS).