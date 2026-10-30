## BUG-001: Lỗi không tìm thấy script chạy test
1. Mã và mức độ: BUG-001 Minor
2. Phát hiện bởi: Quá trình khởi chạy Unit Test bằng Jest tại Buổi 10.
3. Triệu chứng: Gõ lệnh `npm test` trên terminal backend báo lỗi `npm error Missing script: "test"`.
4. Cách tái lập: Mở terminal tại `src/backend` và gõ `npm test`.
5. Nguyên nhân: File `package.json` mặc định của backend chưa định nghĩa lệnh gọi thư viện Jest trong khối scripts.
6. Cách sửa: Thêm dòng `"test": "jest"` vào khối `"scripts"` trong `package.json`.
