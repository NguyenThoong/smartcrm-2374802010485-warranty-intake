# Smart CRM – Phân hệ Tiếp nhận và Phân loại Yêu cầu Bảo hành (Warranty Intake & Classification)

**Sinh viên:** Nguyễn Tấn Hoàng Thông – MSSV: 2374802010485

**Track:** SE

**Học phần:** Chuyên đề Tốt nghiệp 1 – Trường ĐH Văn Lang

## 1. Mô tả bài toán

Luồng nghiệp vụ xử lý tiếp nhận và phân loại bảo hành:

* Khách hàng mang thiết bị đến cửa hàng hoặc gửi yêu cầu tiếp nhận bảo hành; Tiếp tân tiếp nhận thông tin thiết bị (IMEI/Serial), thông tin khách hàng và mô tả lỗi thực tế.

* Hệ thống tra cứu lịch sử mua hàng, tự động đối soát điều kiện bảo hành hợp lệ và chính sách áp dụng.

* Hệ thống tự động phân loại mức độ bảo hành (tiêu chuẩn, tính phí, hoặc từ chối) và tính toán thời hạn cam kết xử lý (SLA).

* Trường hợp vượt hạn mức tiêu chuẩn hoặc có tranh chấp điều kiện, yêu cầu được chuyển sang luồng xét duyệt ngoại lệ cho Quản lý cửa hàng.

* Kết thúc: Khởi tạo phiếu tiếp nhận bảo hành (Ticket), in phiếu hẹn bàn giao cho khách hàng và chuyển giao thiết bị sang bộ phận kỹ thuật (L3).

## 2. Phạm vi

* **Làm:**

  * Tiếp nhận và tra cứu thông tin bảo hành thiết bị theo IMEI/Số điện thoại/Hóa đơn.

  * Tự động kiểm tra thời hạn bảo hành và phân loại điều kiện hợp lệ.

  * Tính toán cam kết thời gian hoàn thành (SLA) theo quy tắc nghiệp vụ chuỗi cửa hàng.

  * Luồng phê duyệt yêu cầu bảo hành ngoại lệ dành cho Quản lý.

  * Quản lý trạng thái tiếp nhận và nhật ký (audit log) của phiếu bảo hành.

  * Kiểm thử tự động API (Jest) và kiểm thử giao diện luồng tiếp nhận (Selenium WebDriver).

* **Không làm:**

  * Quy trình sửa chữa chi tiết của kỹ thuật viên tại phòng Lab (thuộc L3).

  * Quản lý kho linh kiện thay thế chuyên sâu và xuất nhập tồn phụ tùng (thuộc phân hệ Kho).

  * Cổng thanh toán trực tuyến cho các trường hợp sửa chữa tính phí dịch vụ (thuộc phân hệ POS/Kế toán).

## 3. Công nghệ sử dụng

| Thành phần | Công nghệ | 
| ----- | ----- | 
| Backend | Node.js, Express.js | 
| Frontend | ReactJS, TailwindCSS | 
| Database | PostgreSQL | 
| Testing (Unit/Integration) | Jest, Supertest | 
| Testing (E2E / Automation) | Selenium WebDriver | 
| Version Control | Git, GitHub | 

## 4. Cấu trúc thư mục

```
smartcrm-2374802010485-warranty-intake/
├── docs/
│   └── diagrams/           # Tài liệu thiết kế sơ đồ (Use Case, ERD, Sequence, Activity)
├── src/
│   ├── backend/            # Mã nguồn API & Nghiệp vụ backend (Node.js/Express)
│   └── frontend/           # Giao diện người dùng (ReactJS)
├── tests/                  # Kịch bản kiểm thử tự động (Unit Test, Selenium E2E)
├── .env.example            # Mẫu cấu hình biến môi trường
├── .gitignore              # Danh sách file/thư mục loại trừ khỏi Git
└── README.md               # Tài liệu mô tả dự án

```

## 5. Yêu cầu môi trường

* **Node.js**: Phiên bản v18 trở lên.

* **Cơ sở dữ liệu**: PostgreSQL (v15+) - Quản lý qua pgAdmin 4.

* **Cấu hình môi trường**: Yêu cầu tạo file `.env` tại đường dẫn `src/backend/.env` bao gồm các biến sau:

  * `DB_HOST=localhost`

  * `DB_PORT=5432`

  * `DB_NAME=smartcrm`

  * `DB_USER=...` (tài khoản pgAdmin của bạn)

  * `DB_PASSWORD=...` (mật khẩu pgAdmin của bạn)

  * `APP_PORT=3000`

## 6. Trạng thái hiện tại (Cập nhật Buổi 8)

* \[x\] Chốt sơ đồ kiến trúc 4 lớp và tài liệu yêu cầu phi chức năng (NFR).

* \[x\] Khởi tạo Cơ sở dữ liệu `smartcrm` trên PostgreSQL và nạp dữ liệu mẫu (Khách hàng, Thiết bị, Kỹ thuật viên, Phiếu bảo hành).

* \[x\] Thiết lập cấu trúc thư mục Node.js theo chuẩn (Controller, Service, Repository, Routes).

* \[x\] Kết nối thành công ứng dụng Node.js với cơ sở dữ liệu PostgreSQL.

* \[x\] Hoàn thành API CRUD cốt lõi cho Module Ticket: GET danh sách và POST tạo mới.

* \[x\] Bổ sung hình ảnh minh chứng API hoạt động vào thư mục `docs/`.

* \[ \] Viết Unit Test cho tầng Service (Dự kiến triển khai ở buổi tiếp theo).

## 7. Khai báo sử dụng công cụ AI

| Công cụ | Dùng vào việc gì | Cách tự kiểm chứng | 
| ----- | ----- | ----- | 
| Google Gemini | Hỗ trợ khởi tạo cấu trúc thư mục, thiết lập Git/GitHub và soạn thảo khung tài liệu README theo chuẩn checklist | Tự kiểm tra, đối soát trực tiếp với tài liệu đề cương học phần và xác nhận trạng thái lệnh trên terminal | 
| Google Gemini | Gợi ý mô tả luồng nghiệp vụ tiếp nhận và tiêu chí phân loại SLA | Tự rà soát lại tính hợp lý theo yêu cầu bài toán CRM và tài liệu ca sử dụng thực tế | 
| Google Gemini | Hướng dẫn cấu hình kết nối PostgreSQL, thiết lập kiến trúc 3 lớp (Controller-Service-Repository) và gỡ lỗi CSDL | Kiểm tra chéo luồng dữ liệu, xác nhận API chạy thành công và trả về JSON chính xác trên trình duyệt |
| ChatGPT | Hỗ trợ viết Prompt để tối ưu hóa truy vấn cho Gemini thực hiện các nhiệm vụ đồ án | Đọc hiểu, tinh chỉnh lại prompt cho sát với ngữ cảnh thực tế của dự án trước khi sử dụng |
