# Test Plan Rút Gọn - Luồng L2: Tiếp nhận và Phân loại Bảo hành

## 1. Phạm vi
- **Sẽ kiểm thử:** Luồng API tạo phiếu bảo hành (`POST /api/tickets`), kiểm tra logic tính toán hạn cam kết SLA (QT-04), đối soát thời hạn bảo hành (QT-05), xử lý trùng lặp mã phiếu, và cơ chế bảo mật phân quyền theo chủ sở hữu (OWASP A01).
- **CHỦ Ý KHÔNG kiểm thử:** Các màn hình cấu hình danh mục (chỉ đọc, không chứa quy tắc nghiệp vụ cốt lõi); Không kiểm thử hiệu năng và chịu tải (thuộc phạm vi Chuyên đề Tốt nghiệp 2).

## 2. Loại test và số lượng
- **Tổng số lượng:** 12 test case (7 Unit Test cho tầng Service, 2 Integration Test kết nối DB, 3 API Test qua Supertest).
- **Kỹ thuật chọn dữ liệu:** Áp dụng phương pháp phân vùng tương đương và giá trị biên cho các quy tắc thời gian bảo hành (QT-05) và độ dài mô tả lỗi.
- **Bao phủ 5 loại test bắt buộc:** Luồng đúng (x4), Giá trị biên (x2 ở 2 bên ranh giới), Dữ liệu sai (x2), Bảo mật kiểm soát truy cập (x1), Tái lập kịch bản CSDL (x1).

## 3. Tiêu chí thành công
- 12/12 test case có kết quả chạy thực tế và đạt trạng thái PASS.
- Mọi quy tắc nghiệp vụ (QT) đã hiện thực đều có ít nhất 1 test case bao phủ.
- KHÔNG còn bất kỳ bug nào ở mức độ CRITICAL đang mở. Các bug MAJOR (nếu còn) phải có hướng xử lý và tài liệu hóa rõ ràng. (Tiêu chí này được thiết lập trước khi tiến hành chạy test).

## 4. Môi trường và dữ liệu thử
- **Môi trường chạy:** Node.js (v18+), cơ sở dữ liệu PostgreSQL (v15+) chạy trên localhost.
- **Dữ liệu thử:** Khởi tạo thông qua kịch bản `resetDb()` và nạp dữ liệu mẫu bằng `seedDemo()` trước **mỗi** test case, đảm bảo tính độc lập và không phụ thuộc vào dữ liệu có sẵn trên máy cục bộ.
- **Lệnh thực thi bộ test:** `npm test`