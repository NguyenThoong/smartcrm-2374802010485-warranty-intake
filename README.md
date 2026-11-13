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
| Frontend | ReactJS (Vite), React Router | 
| Database | PostgreSQL | 
| Testing (Unit/Integration) | Jest | 
| Version Control | Git, GitHub | 

## 4. Cấu trúc thư mục

```text
smartcrm-2374802010485-warranty-intake/
├── docs/
│   ├── diagrams/           # Tài liệu thiết kế sơ đồ (Use Case, ERD, Sequence, Activity)
│   └── ...                 # Các bằng chứng ảnh chụp (E2E, Unit Test, API)
├── src/
│   ├── backend/            # Mã nguồn API & Nghiệp vụ backend (Node.js/Express)
│   └── frontend/           # Giao diện người dùng (ReactJS/Vite)
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

## 🚀 Hướng dẫn chạy dự án với Docker

1. Clone repository về máy:
   ```bash
   git clone https://github.com/NguyenThoong/smartcrm-2374802010485-warranty-intake.git
   cd smartcrm-2374802010485-warranty-intake
   ```

2. Tạo file môi trường từ file mẫu:
   ```bash
   cp .env.example .env
   ```

3. Khởi chạy hệ thống bằng Docker Compose:
   ```bash
   docker compose up -d --build
   ```

4. Kiểm tra trạng thái các container:
   ```bash
   docker compose ps
   ```

## 6. Hướng dẫn cài đặt và khởi chạy (Thủ công / Local)

### Bước 1: Cấu hình cơ sở dữ liệu

1.  Mở **pgAdmin 4** và tạo một Database trống có tên `smartcrm`.
2.  Mở **Query Tool** của Database `smartcrm` vừa tạo.
3.  Sao chép toàn bộ nội dung file `src/backend/schema.sql` vào Query
    Tool.
4.  Nhấn **F5** để khởi tạo các bảng và dữ liệu mẫu.

### Bước 2: Cấu hình biến môi trường và chạy Backend

Mở Terminal và di chuyển vào thư mục Backend, sau đó sao chép file cấu
hình mẫu và cài đặt các thư viện cần thiết:

``` bash
cd src/backend
cp .env.example .env
npm install
```

Mở file `.env` vừa được tạo trong thư mục `src/backend`, sau đó điền
`DB_USER` và `DB_PASSWORD` tương ứng với tài khoản PostgreSQL của bạn.

Khởi chạy Backend bằng lệnh:

``` bash
npm run dev
```

Backend sẽ hoạt động tại địa chỉ:

``` text
http://localhost:3000
```

### Bước 3: Chạy Frontend (Giao diện người dùng)

Mở **một Terminal mới** và giữ nguyên Terminal đang chạy Backend. Tiếp
theo, di chuyển vào thư mục Frontend, cài đặt thư viện và khởi chạy ứng
dụng:

``` bash
cd src/frontend
npm install
npm run dev
```

Sau khi Frontend khởi chạy thành công, mở trình duyệt và truy cập:

``` text
http://localhost:5173
```

### Bước 4: Chạy Unit Test (Kiểm thử logic nghiệp vụ)

Mở Terminal, di chuyển vào thư mục Backend và chạy lệnh kiểm thử:

``` bash
cd src/backend
npm test
```

Hệ thống sẽ chạy **3 test cases Jest**, bao phủ các trường hợp luồng
đúng, giá trị biên và trường hợp lỗi. Kết quả kiểm thử sẽ được hiển thị
trong Terminal; các test cases đạt yêu cầu sẽ có trạng thái `PASS`.

## 7. Khai báo sử dụng công cụ AI

| Công cụ | Dùng vào việc gì | Cách tự kiểm chứng | 
| ----- | ----- | ----- | 
| Google Gemini | Hỗ trợ khởi tạo cấu trúc thư mục, thiết lập Git/GitHub và soạn thảo khung tài liệu README theo chuẩn checklist | Tự kiểm tra, đối soát trực tiếp với tài liệu đề cương học phần và xác nhận trạng thái lệnh trên terminal | 
| Google Gemini | Gợi ý mô tả luồng nghiệp vụ tiếp nhận và tiêu chí phân loại SLA | Tự rà soát lại tính hợp lý theo yêu cầu bài toán CRM và tài liệu ca sử dụng thực tế | 
| Google Gemini | Hướng dẫn cấu hình kết nối PostgreSQL, thiết lập kiến trúc 3 lớp và gỡ lỗi CSDL | Kiểm tra chéo luồng dữ liệu, xác nhận API chạy thành công và trả về JSON chính xác |
| ChatGPT | Hỗ trợ viết Prompt để tối ưu hóa truy vấn cho Gemini | Đọc hiểu, tinh chỉnh lại prompt cho sát với ngữ cảnh thực tế của dự án |
| Google Gemini | Sinh mã ReactJS (Hook, Component), cấu hình bộ định tuyến và thiết lập Jest Unit Test cho Buổi 10 | Tắt mở server để test trạng thái lỗi giao diện, chạy E2E và xác nhận terminal báo PASS toàn bộ các test case |