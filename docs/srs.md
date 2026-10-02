# Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) Rút gọn
**Dự án:** Smart CRM – Phân hệ Tiếp nhận và Phân loại Yêu cầu Bảo hành (L2)
**Tác giả:** Nguyễn Tấn Hoàng Thông (MSSV: 2374802010485) - Track SE

---

## 1. Giới thiệu và Phạm vi
**Bối cảnh & Luồng nghiệp vụ:** 
Hệ thống hỗ trợ nhân viên cửa hàng tiếp nhận thiết bị lỗi từ khách hàng, tra cứu lịch sử mua hàng, tự động đánh giá điều kiện bảo hành và tính toán thời gian cam kết trả máy (SLA). Các trường hợp ngoại lệ sẽ được chuyển cho Quản lý cửa hàng xét duyệt trước khi bàn giao cho bộ phận kỹ thuật.

**Phạm vi KHÔNG thực hiện (Mức WON'T):**
- KHÔNG quản lý luồng sửa chữa chi tiết bên trong phòng Lab (thuộc L3).
- KHÔNG quản lý xuất/nhập linh kiện thay thế tại kho.
- KHÔNG tích hợp cổng thanh toán trực tuyến cho dịch vụ sửa chữa tính phí.

**Bảng thuật ngữ (Sử dụng thống nhất toàn tài liệu):**
| Thuật ngữ | Diễn giải |
|---|---|
| **Ticket (Phiếu bảo hành)** | Chứng từ ghi nhận thông tin thiết bị lỗi, tình trạng tiếp nhận và mã theo dõi để giao cho khách hàng. |
| **SLA (Service Level Agreement)** | Thời hạn cam kết tối đa phải hoàn thành xử lý lỗi và trả máy cho khách. |
| **Ngoại lệ (Exception)** | Các trường hợp máy trễ hạn bảo hành ngắn ngày hoặc rách tem cần sự phê duyệt đặc biệt từ Quản lý. |

---

## 2. Các bên liên quan và vai trò
1. **Tiếp tân (Front-desk Staff):**
   - **Được làm:** Tra cứu thiết bị, tạo Ticket, gửi yêu cầu xét duyệt ngoại lệ, in biên nhận bàn giao, cập nhật trạng thái bàn giao Kỹ thuật.
   - **Không được làm:** Tự ý duyệt các trường hợp bảo hành ngoại lệ sai quy định.
2. **Quản lý cửa hàng (Store Manager):**
   - **Được làm:** Xem danh sách yêu cầu ngoại lệ, phê duyệt (Approve) hoặc từ chối (Reject) yêu cầu tiếp nhận bảo hành đặc biệt.
   - **Không được làm:** Sửa đổi mã phần cứng hoặc thay đổi trạng thái thiết bị đã chuyển qua kho Kỹ thuật.

---

## 3. Yêu cầu chức năng (FR) và User Story (US)

**FR1: Quản lý tra cứu thông tin thiết bị**
- **US1 (MUST):** Là Tiếp tân, tôi muốn tra cứu thông tin thiết bị qua số IMEI/Serial để xác định lịch sử mua hàng một cách chính xác.
- **US2 (SHOULD):** Là Tiếp tân, tôi muốn thấy cảnh báo nổi bật nếu thiết bị này từng bị từ chối bảo hành trước đây để tránh tiếp nhận nhầm.

**FR2: Phân loại và tính toán SLA tự động**
- **US3 (MUST):** Là Tiếp tân, tôi muốn hệ thống tự động tính toán số ngày còn lại của hạn bảo hành để biết máy có hợp lệ hay không.
- **US4 (MUST):** Là Hệ thống, tôi muốn tự động tính toán thời hạn SLA trả máy (ví dụ: 3 ngày, 5 ngày) dựa trên mức độ lỗi và loại thiết bị để hiển thị lên biên nhận.

**FR3: Quản lý luồng xét duyệt ngoại lệ**
- **US5 (MUST):** Là Quản lý cửa hàng, tôi muốn xem danh sách các yêu cầu bảo hành ngoại lệ để quyết định duyệt hay từ chối tiếp nhận.
- **US6 (COULD):** Là Quản lý cửa hàng, tôi muốn ghi chú lý do khi từ chối ngoại lệ để Tiếp tân có cơ sở giải thích lại cho khách hàng.

**FR4: Quản lý Ticket và Biên nhận**
- **US7 (MUST):** Là Tiếp tân, tôi muốn hệ thống khởi tạo Ticket bảo hành và in biên nhận (có mã vạch) để giao cho khách hàng theo dõi.

**FR5: Bàn giao và Thông báo**
- **US8 (MUST):** Là Tiếp tân, tôi muốn cập nhật trạng thái Ticket thành "Đã bàn giao Kỹ thuật" để kết thúc luồng tiếp nhận và chuyển giao thiết bị cho phòng Lab (L3).

---

## 4. Yêu cầu phi chức năng (NFR)
*Lưu ý: Tất cả NFR đều có ngưỡng số đo lường.*

- **NFR1 (Hiệu năng):** Thời gian phản hồi của API tra cứu thiết bị (theo IMEI) không được vượt quá **1.5 giây** với cơ sở dữ liệu lên đến **100.000 bản ghi**.
- **NFR2 (Khả năng chịu tải):** Hệ thống backend phải chịu được tải đồng thời lên đến **50 yêu cầu tạo Ticket/giây** mà không bị ngắt kết nối (crash).
- **NFR3 (Tính khả dụng):** Tỉ lệ thời gian hoạt động ổn định (Uptime) của phân hệ tiếp nhận phải đạt **99.9%** trong giờ hành chính (8:00 - 22:00) để không làm gián đoạn việc nhận máy của khách.

---

## 5. Ràng buộc và quy tắc nghiệp vụ
- **BR1:** Hệ thống KHÔNG được phép chuyển trạng thái Ticket sang "Hợp lệ" nếu số IMEI tra cứu không tồn tại trong lịch sử bán hàng của chuỗi, trừ khi có phê duyệt ngoại lệ từ Quản lý.
- **BR2:** Thời gian cam kết (SLA) tiêu chuẩn cho các thiết bị di động phân khúc cao cấp là **tối đa 03 ngày làm việc**; các thiết bị khác là **05 ngày làm việc**.
- **BR3:** Việc thay đổi trạng thái từ "Chờ duyệt ngoại lệ" sang "Đã tiếp nhận" CHỈ BẮT BUỘC được thực hiện bởi tài khoản có quyền Quản lý cửa hàng (Store Manager).

---

## 6. Bảng truy vết yêu cầu (Traceability Matrix)

| Yêu cầu chức năng (FR) | Mã User Story | Mã Use Case (UC) | Mức độ ưu tiên (MoSCoW) |
|---|---|---|---|
| FR1: Tra cứu thiết bị | US1 | UC-01 | MUST |
| FR1: Tra cứu thiết bị | US2 | UC-01 | SHOULD |
| FR2: Phân loại & SLA | US3 | UC-02 | MUST |
| FR2: Phân loại & SLA | US4 | UC-03 | MUST |
| FR3: Xét duyệt ngoại lệ| US5 | UC-04, UC-05 | MUST |
| FR3: Xét duyệt ngoại lệ| US6 | UC-05 | COULD |
| FR4: Tạo Ticket | US7 | UC-06 | MUST |
| FR5: Bàn giao & Thông báo | US8 | UC-07 | MUST |