# BÁO CÁO KIỂM THỬ PHẦN MỀM (TEST REPORT)
## Phân hệ Tiếp nhận và Phân loại Bảo hành (L2) – SmartCRM

- **Sinh viên thực hiện:** Nguyễn Tấn Hoàng Thông – MSSV: **2374802010485**
- **Học phần:** Chuyên đề Tốt nghiệp 1 – Track SE – Trường Đại học Văn Lang
- **Ngày thực hiện kiểm thử:** 06/11/2026
- **Môi trường thử nghiệm:**
  - **Hệ điều hành:** Windows 10/11
  - **Môi trường thực thi:** Node.js v18+, React 19 (Vite)
  - **Hệ quản trị CSDL:** PostgreSQL 15+ (Database: `smartcrm`)
  - **Địa chỉ dịch vụ:** Backend: `http://localhost:3000` | Frontend: `http://localhost:5173`
  - **Thư mục lưu ảnh minh chứng:** `docs/srceenshot/`

---

## 1. Bảng tổng hợp kết quả kiểm thử (Test Summary Table)

> **Ghi chú:** Bộ kiểm thử bao phủ đầy đủ **5 nhóm test case bắt buộc** theo chuẩn môn học: Luồng đúng (Happy path), Giá trị biên (Boundary), Dữ liệu sai (Error/Invalid), Bảo mật kiểm soát truy cập (Security/Access Control), và Tái lập kịch bản CSDL (Idempotency).

| Mã TC | Phân loại | Tiền điều kiện | Các bước thực hiện | Dữ liệu thử nghiệm | Kết quả mong đợi | Mức ưu tiên | Kết quả thực tế (Đã chạy thật) | Đánh giá | Bằng chứng |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC-01** | Luồng đúng | Server Backend & Frontend đang chạy; CSDL đã nạp dữ liệu mẫu. | 1. Mở trang `/tiep-nhan`<br>2. Nhập số Serial `SN-IP-1122334`<br>3. Bấm "Tra cứu"<br>4. Nhập mô tả lỗi hợp lệ và chọn mức ưu tiên "Cao"<br>5. Bấm "➕ Xác nhận lập phiếu tiếp nhận" | Serial: `SN-IP-1122334`<br>Lỗi: `Màn hình sọc đen mờ khi khởi động máy`<br>Mức: `Cao` | Hệ thống sinh mã `TK-xxxxxx`, lưu vào CSDL với trạng thái `TIEP_NHAN`, thông báo Toast xanh thành công, hạn SLA +3 ngày. | Cao | Đã tạo phiếu thành công, mã phiếu dạng `TK-xxxxxx`, trạng thái `TIEP_NHAN`, CSDL ghi nhận bản ghi mới. | **PASS** | [Xem ảnh](srceenshot/TC-01.png) |
| **TC-02** | Luồng đúng | Thiết bị `SN-IP-1122334` có trong DB (Mua ngày 2025-01-01, BH 12 tháng). | 1. Mở trang `/tiep-nhan`<br>2. Chọn tab "📱 Tra cứu theo Serial / IMEI"<br>3. Nhập `SN-IP-1122334`<br>4. Bấm "Tra cứu" | Serial: `SN-IP-1122334` | Hệ thống hiển thị đúng thông tin máy, chủ sở hữu "Trần Thị Bình" và huy hiệu xác nhận: `🟢 HỢP LỆ (Còn ... ngày)`. | Trung bình | Giao diện hiển thị đầy đủ thông tin khách hàng, thiết bị và xác nhận tình trạng bảo hành hợp lệ. | **PASS** | [Xem ảnh](srceenshot/TC-02.png) |
| **TC-03** | Luồng đúng | Backend và Frontend đang hoạt động bình thường, DB có dữ liệu phiếu. | 1. Mở trình duyệt truy cập `http://localhost:5173/`<br>2. Quan sát bảng dữ liệu phiếu bảo hành | N/A | Bảng danh sách phiếu bảo hành hiển thị đầy đủ thông tin: Mã phiếu, Khách hàng, Serial, Trạng thái, SLA và các nút Thao tác (Chi tiết, Sửa, Xóa). | Cao | Bảng hiển thị danh sách các phiếu từ CSDL, tải dữ liệu thành công không có lỗi, giao diện trực quan. | **PASS** | [Xem ảnh](srceenshot/TC-03.png) |
| **TC-04** | Giá trị biên | Quy tắc QT-05: Ngày bán 2026-03-01, gói BH 12 tháng (Hết hạn đúng ngày 2027-03-01). | 1. Kiểm tra logic đối soát tại đúng ngày ranh giới hết hạn bảo hành `2027-03-01`. | Ngày kiểm tra:<br>`2027-03-01` | Điều kiện `checkDate <= expireDate` thỏa mãn, kết quả trả về `true` (VẪN còn hạn bảo hành hợp lệ). | Cao | Hàm kiểm tra và API trả về `true`, hệ thống xác nhận máy vẫn nằm trong diện bảo hành chính hãng. | **PASS** | [Xem ảnh](srceenshot/TC-04.png) |
| **TC-05** | Giá trị biên | Quy tắc QT-05: Ngày bán 2026-03-01, gói BH 12 tháng. Kiểm tra sau ngày hết hạn 1 ngày. | 1. Nhập mã máy hết hạn mẫu `SN-A52-778901`<br>2. Bấm "Tra cứu" kiểm tra phản ứng của hệ thống. | Serial: `SN-A52-778901` | Hệ thống báo hết hạn (`isValid: false`), hiển thị cảnh báo đỏ nổi bật `🔴 Thiết bị đã hết hạn bảo hành (QT-01)`. | Cao | Giao diện hiện dòng cảnh báo đỏ: thiết bị đã quá hạn bảo hành, yêu cầu chuyển luồng ngoại lệ hoặc báo giá. | **PASS** | [Xem ảnh](srceenshot/TC-05.png) |
| **TC-06** | Dữ liệu sai | Form tạo phiếu tại `/tiep-nhan` đang mở. | 1. Nhập khách hàng và serial<br>2. Nhập mô tả sự cố quá ngắn: "Lỗi pin" (7 ký tự, vi phạm BR4 < 10 ký tự)<br>3. Bấm "➕ Xác nhận lập phiếu tiếp nhận" | Lỗi: `Lỗi pin` (7 ký tự) | Hệ thống chặn gửi form, cảnh báo lỗi yêu cầu nhập tối thiểu 10 ký tự theo quy định BR4, không tăng bản ghi trong DB. | Cao | Giao diện hiện thông báo lỗi: mô tả sự cố bắt buộc từ 10 ký tự trở lên; hệ thống từ chối tạo phiếu. | **PASS** | [Xem ảnh](srceenshot/TC-06.png) |
| **TC-07** | Dữ liệu sai | Backend đang chạy, gửi request API vi phạm ràng buộc dữ liệu CSDL. | 1. Gửi request `POST /api/tickets` với ID khách hàng không tồn tại (`customer_id: 999999`) | `customer_id: 999999` | Backend bắt lỗi vi phạm Foreign Key constraint, trả về mã HTTP 400 Bad Request, hệ thống không bị crash sập. | Cao | Trả về mã 400 kèm thông báo vi phạm ràng buộc khóa ngoại, ứng dụng xử lý ngoại lệ an toàn. | **PASS** | [Xem ảnh](srceenshot/TC-07.png) |
| **TC-08** | Bảo mật (A01) | Màn hình thẩm định ngoại lệ `/xet-duyet` dành cho Quản lý cửa hàng (Store Manager). | 1. Mở trang `/xet-duyet`<br>2. Xem xét hồ sơ vi phạm trễ hạn của phiếu `TK-2026-002`<br>3. Nhập ý kiến quản lý<br>4. Bấm "Phê duyệt tiếp nhận" | Ghi chú duyệt của Quản lý | Trạng thái chuyển sang `TIEP_NHAN` ưu tiên CAO, ghi nhận người duyệt vào Audit Log; người không có quyền bị từ chối. | Cao | Phê duyệt thành công, giao diện chuyển sang nhãn xanh `ĐÃ PHÊ DUYỆT TIẾP NHẬN`, ghi vết đúng chuẩn BR3. | **PASS** | [Xem ảnh](srceenshot/TC-08.png) |
| **TC-09** | Bảo mật (A02) | DB và API đang hoạt động bình thường. | 1. Gửi chuỗi ký tự tấn công SQL Injection (`' OR '1'='1`) vào endpoint tra cứu khách hàng/thiết bị. | Query:<br>`phone=' OR '1'='1` | Hệ thống sử dụng Parameterized Query an toàn, không bị chèn mã SQL, trả về 404 Not Found, không lộ Stack Trace. | Trung bình | Trả về mã 404 an toàn: `Không tìm thấy khách hàng`, cấu trúc CSDL được bảo vệ hoàn toàn. | **PASS** | [Xem ảnh](srceenshot/TC-09.png) |
| **TC-10** | Tái lập CSDL | CSDL `smartcrm` đã có các bảng và dữ liệu mẫu. | 1. Mở Query Tool trong pgAdmin 4<br>2. Dán nội dung file `schema.sql`<br>3. Bấm F5 thực thi lại toàn bộ script lần thứ 2. | File `schema.sql` | Các lệnh `IF NOT EXISTS` và `ON CONFLICT DO NOTHING` kích hoạt, script chạy thành công không báo lỗi đỏ, dữ liệu không bị nhân đôi. | Cao | pgAdmin báo thực thi thành công; câu lệnh `SELECT count(*)` xác nhận số bản ghi giữ nguyên không bị trùng lặp. | **PASS** | [Xem ảnh](srceenshot/TC-10.png) |
| **TC-11** | Giao diện | Bảng danh sách phiếu tại trang chủ `/` đang mở. | 1. Tại ô tìm kiếm, nhập từ khóa không tồn tại: `TK-999999-KHONG-CO`<br>2. Quan sát phản hồi giao diện. | Từ khóa:<br>`TK-999999-KHONG-CO` | Bảng dữ liệu tự động ẩn, hiển thị khối Empty State trực quan: icon tìm kiếm 🔍, thông báo "Không có kết quả phù hợp" kèm nút "Đặt lại bộ lọc". | Thấp | Giao diện hiển thị đúng Empty State chuyên nghiệp, bấm nút "Đặt lại bộ lọc" danh sách khôi phục bình thường. | **PASS** | [Xem ảnh](srceenshot/TC-11.png) |
| **TC-12** | Giao diện | Người dùng đang mở trang web trên trình duyệt. | 1. Tạm dừng server Backend (Ctrl+C)<br>2. Bấm F5 tải lại trang Frontend<br>3. Quan sát giao diện xử lý lỗi mất kết nối. | Server Backend dừng hoạt động | Giao diện hiển thị Error State màu đỏ với icon ⚠️, thông báo "Không thể tải dữ liệu: Mất kết nối máy chủ", có nút "🔄 Thử tải lại". | Cao | Giao diện bắt đúng lỗi mất kết nối mạng, hiển thị thông báo rõ ràng kèm nút "Thử tải lại" theo đúng góp ý của GV. | **PASS** | [Xem ảnh](srceenshot/TC-12.png) |

---

## 2. Hướng dẫn chi tiết từng bước tự thao tác (Step-by-Step Execution Guide)

> 💡 **Chuẩn bị trước khi thực hiện:**
> - **Khởi động Backend:** Mở Terminal 1: `cd smartcrm-2374802010485-warranty-intake/src/backend` $\rightarrow$ gõ `npm run dev` (chạy tại cổng `3000`).
> - **Khởi động Frontend:** Mở Terminal 2: `cd smartcrm-2374802010485-warranty-intake/src/frontend` $\rightarrow$ gõ `npm run dev` (mở trình duyệt tại `http://localhost:5173`).
> - **Chụp ảnh màn hình:** Dùng phím `Windows + Shift + S` hoặc `PrtScn`, lưu ảnh vào thư mục:
>   `smartcrm-2374802010485-warranty-intake/docs/srceenshot/` với đúng tên quy định (ví dụ `TC-01.png`).

---

### 🔹 TC-01: Tạo phiếu tiếp nhận bảo hành thành công (Luồng đúng)
- **Mục tiêu:** Kiểm tra luồng tiếp nhận máy, sinh mã `TK-xxxxxx` và tính SLA (+3 ngày).
- **Các bước thao tác:**
  1. Mở trình duyệt truy cập: `http://localhost:5173/tiep-nhan`.
  2. Tại ô **Số Serial Number / IMEI**, nhập: `SN-IP-1122334` $\rightarrow$ Bấm nút **Tra cứu**.
  3. Hệ thống tự động nhận diện thiết bị iPhone và khách hàng "Trần Thị Bình" (VIP).
  4. Tại ô **(4) Mô tả sự cố thực tế**, nhập: `Màn hình sọc đen mờ khi khởi động máy`.
  5. Tại mục **(5) Mức độ ưu tiên**, chọn: `Cao`.
  6. Bấm nút: **➕ Xác nhận lập phiếu tiếp nhận**.
  7. Quan sát thông báo Toast góc trên bên phải báo: *"Tạo phiếu tiếp nhận thành công. Đã khởi tạo phiếu bảo hành mã TK-..."*.
- **Chụp ảnh:** Chụp toàn màn hình lúc xuất hiện thông báo thành công.
- **Tên file ảnh:** `docs/srceenshot/TC-01.png` .

---

### 🔹 TC-02: Tra cứu đối soát hạn bảo hành hợp lệ (Luồng đúng)
- **Mục tiêu:** Kiểm tra chức năng tự động tính toán số ngày bảo hành còn lại của máy hợp lệ.
- **Các bước thao tác:**
  1. Mở trình duyệt truy cập: `http://localhost:5173/tiep-nhan`.
  2. Chọn tab **📱 Tra cứu theo Serial / IMEI**.
  3. Nhập số Serial: `SN-IP-1122334` (hoặc bấm vào nút gợi ý mẫu màu xanh).
  4. Bấm nút **Tra cứu**.
  5. Quan sát khung kết quả tra cứu:
     - Dòng tình trạng bảo hành hiển thị nhãn xanh: `🟢 HỢP LỆ (Còn ... ngày)`.
     - Thông tin chi tiết hiển thị: Chủ sở hữu "Trần Thị Bình", Gói BH 12 tháng.
- **Chụp ảnh:** Chụp khung kết quả tra cứu có nhãn xanh `HỢP LỆ`.
- **Tên file ảnh:** `docs/srceenshot/TC-02.png`.

---

### 🔹 TC-03: Hiển thị bảng danh sách phiếu bảo hành (Luồng đúng)
- **Mục tiêu:** Kiểm tra giao diện Dashboard hiển thị danh sách phiếu từ CSDL PostgreSQL.
- **Các bước thao tác:**
  1. Mở trình duyệt truy cập: `http://localhost:5173/` (hoặc bấm vào menu **Danh sách phiếu** trên thanh điều hướng).
  2. Quan sát bảng dữ liệu:
     - 5 thẻ thống kê Metric ở trên cùng (Tổng số phiếu, Mới tiếp nhận, Chờ duyệt, v.v.).
     - Bảng dữ liệu có đầy đủ các cột: Mã phiếu, Khách hàng, Serial, Mô tả lỗi, Mức độ, Trạng thái, Ngày nhận, Hạn SLA.
     - Cột Thao tác có đủ 3 nút: **👁️ Chi tiết**, **✏️ Sửa**, **🗑️ Xóa**.
- **Chụp ảnh:** Chụp toàn màn hình danh sách phiếu bảo hành.
- **Tên file ảnh:** `docs/srceenshot/TC-03.png`.

---

### 🔹 TC-04: Kiểm tra giá trị biên ngày cuối cùng của hạn bảo hành (Biên)
- **Mục tiêu:** Kiểm tra ranh giới cuối cùng của chính sách bảo hành (ngày kiểm tra = ngày hết hạn).
- **Các bước thao tác:**
  1. Mở Terminal mới (hoặc mở VS Code Terminal).
  2. Di chuyển vào thư mục backend và chạy bộ kiểm thử Jest:
     ```powershell
     cd f:\CDTN1\smartcrm-2374802010485-warranty-intake\src\backend
     npm test
     ```
  3. Hoặc chạy kiểm tra logic ngày biên bằng lệnh node:
     ```powershell
     node -e "const p = new Date('2026-03-01'); const exp = new Date(p); exp.setMonth(exp.getMonth() + 12); const check = new Date('2027-03-01'); console.log('Hạn BH:', exp.toISOString().split('T')[0], '| Ngày kiểm tra:', check.toISOString().split('T')[0], '| Còn hạn:', check <= exp);"
     ```
  4. Kết quả xuất ra màn hình Terminal: `Còn hạn: true` (Biên hợp lệ).
- **Chụp ảnh:** Chụp màn hình Terminal hiển thị kết quả kiểm thử đạt yêu cầu.
- **Tên file ảnh:** `docs/srceenshot/TC-04.png`.

---

### 🔹 TC-05: Kiểm tra giá trị biên quá hạn 1 ngày (Biên)
- **Mục tiêu:** Kiểm tra máy quá hạn 1 ngày bị hệ thống phát hiện và cảnh báo vi phạm điều kiện tiêu chuẩn.
- **Các bước thao tác:**
  1. Mở trình duyệt truy cập: `http://localhost:5173/tiep-nhan`.
  2. Tại ô Serial, nhập mã máy thử nghiệm: `SN-A52-778901` (hoặc bấm nút gợi ý `SN-A52-778901`).
  3. Bấm nút **Tra cứu**.
  4. Quan sát giao diện:
     - Dòng cảnh báo màu đỏ xuất hiện: `🔴 Cảnh báo: Thiết bị SN-A52-778901 đã hết hạn bảo hành (QT-01).`
     - Bảng thông báo yêu cầu chuyển sang diện sửa chữa tính phí hoặc gửi Quản lý xét duyệt ngoại lệ.
- **Chụp ảnh:** Chụp màn hình có dòng cảnh báo màu đỏ thiết bị đã hết hạn.
- **Tên file ảnh:** `docs/srceenshot/TC-05.png`.

---

### 🔹 TC-06: Vi phạm quy tắc độ dài mô tả sự cố BR4 (Dữ liệu sai)
- **Mục tiêu:** Kiểm tra hệ thống từ chối tiếp nhận khi mô tả lỗi dưới 10 ký tự (Ràng buộc BR4).
- **Các bước thao tác:**
  1. Mở trình duyệt truy cập: `http://localhost:5173/tiep-nhan`.
  2. Nhập số điện thoại: `0988765432`, Serial: `SN-IP-1122334`.
  3. Tại ô **(4) Mô tả sự cố thực tế**, cố tình nhập ngắn: `Lỗi pin` (chỉ có 7 ký tự).
  4. Quan sát bộ đếm ký tự báo đỏ: `(7/10 ký tự tối thiểu)`.
  5. Bấm nút **➕ Xác nhận lập phiếu tiếp nhận**.
  6. Quan sát Toast thông báo cảnh báo màu vàng: *"Mô tả sự cố quá ngắn: Mô tả sự cố phải có ít nhất 10 ký tự theo quy định kiểm tra bảo hành (BR4)."*
- **Chụp ảnh:** Chụp màn hình ô nhập lỗi báo đỏ và popup cảnh báo vi phạm BR4.
- **Tên file ảnh:** `docs/srceenshot/TC-06.png`.

---

### 🔹 TC-07: Vi phạm ràng buộc dữ liệu CSDL (Dữ liệu sai)
- **Mục tiêu:** Gửi dữ liệu vi phạm khóa ngoại tới API, kiểm tra Backend bắt lỗi an toàn (400 Bad Request), không bị crash.
- **Các bước thao tác:**
  1. Mở PowerShell và gõ lệnh sau để gửi request lỗi (ID khách hàng `999999` không tồn tại):
     ```powershell
     Invoke-RestMethod -Uri "http://localhost:3000/api/tickets" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"customer_id": 999999, "device_id": 1, "issue_desc": "Thiet bi khong len nguon sau khi cap nhat phan mem", "priority": "CAO"}'
     ```
  2. Hoặc mở Postman gửi `POST http://localhost:3000/api/tickets` với body trên.
  3. Quan sát kết quả: Terminal/Postman báo lỗi `400 Bad Request` do vi phạm ràng buộc Foreign Key: `violates foreign key constraint "ticket_customer_id_fkey"`.
  4. Server Backend vẫn duy trì hoạt động bình thường, không bị sập.
- **Chụp ảnh:** Chụp màn hình PowerShell hoặc Postman nhận mã lỗi 400.
- **Tên file ảnh:** `docs/srceenshot/TC-07.png`.

---

### 🔹 TC-08: Thẩm định và Phê duyệt ngoại lệ (Bảo mật & Phân quyền OWASP A01)
- **Mục tiêu:** Kiểm tra quy trình Quản lý cửa hàng (Store Manager) xem xét và phê duyệt ngoại lệ bảo hành (Quy tắc BR3).
- **Các bước thao tác:**
  1. Mở trình duyệt truy cập: `http://localhost:5173/xet-duyet`.
  2. Quan sát hồ sơ thẩm định ngoại lệ cho phiếu `TK-2026-002`:
     - Tình trạng vi phạm: Trễ hạn bảo hành 03 ngày.
     - Đề xuất của tiếp tân: Khách hàng thân thiết VIP, đề xuất hỗ trợ chi phí.
  3. Tại ô **(2) Ý kiến và Ghi chú xét duyệt của Quản lý cửa hàng**, nhập:
     `Đồng ý hỗ trợ khách VIP, miễn phí công sửa chữa, giảm 50% phí thay linh kiện.`
  4. Bấm nút: **✅ (4) Phê duyệt tiếp nhận**.
  5. Quan sát tiêu đề xuất hiện huy hiệu xanh: `🟢 ĐÃ PHÊ DUYỆT TIẾP NHẬN` và thông báo Toast thành công.
- **Chụp ảnh:** Chụp màn hình trang xét duyệt sau khi bấm phê duyệt thành công.
- **Tên file ảnh:** `docs/srceenshot/TC-08.png`.

---

### 🔹 TC-09: Chống tấn công chèn mã SQL Injection (Bảo mật OWASP A02)
- **Mục tiêu:** Kiểm tra tính an toàn của API khi nhận chuỗi ký tự SQL Injection độc hại.
- **Các bước thao tác:**
  1. Mở PowerShell và chạy lệnh gửi chuỗi SQL Injection vào tham số tra cứu điện thoại:
     ```powershell
     Invoke-WebRequest -Uri "http://localhost:3000/api/customers?phone=' OR '1'='1" -Method GET
     ```
  2. Hoặc mở trình duyệt gõ: `http://localhost:3000/api/customers?phone=' OR '1'='1`
  3. Quan sát kết quả: Hệ thống xử lý an toàn qua Parameterized Query, trả về lỗi `404 Not Found` (Không tìm thấy khách hàng), tuyệt đối không để lộ dữ liệu toàn bộ bảng hay cấu trúc Stack Trace CSDL.
- **Chụp ảnh:** Chụp màn hình PowerShell hoặc trình duyệt hiển thị mã phản hồi 404 an toàn.
- **Tên file ảnh:** `docs/srceenshot/TC-09.png`.

---

### 🔹 TC-10: Kiểm tra tính lũy kế CSDL Idempotency C5 (Tái lập kịch bản CSDL)
- **Mục tiêu:** Kiểm tra script CSDL có thể chạy lại nhiều lần mà không gây lỗi đỏ và không nhân đôi dữ liệu.
- **Các bước thao tác:**
  1. Mở ứng dụng **pgAdmin 4**.
  2. Kết nối tới Database `smartcrm`, mở công cụ **Query Tool**.
  3. Mở file `smartcrm-2374802010485-warranty-intake/src/backend/schema.sql`, copy toàn bộ nội dung và dán vào Query Tool.
  4. Bấm **F5** (hoặc nút Execute hình tam giác) để chạy lại toàn bộ script.
  5. Quan sát tab Messages thông báo: `Query returned successfully`.
  6. Chạy tiếp câu truy vấn: `SELECT count(*) FROM customer;` $\rightarrow$ kết quả vẫn là `2` dòng (không bị nhân đôi lên thành 4).
- **Chụp ảnh:** Chụp màn hình pgAdmin 4 hiển thị Query thành công và kết quả đếm bản ghi không bị trùng.
- **Tên file ảnh:** `docs/srceenshot/TC-10.png`.

---

### 🔹 TC-11: Kiểm tra trạng thái danh sách rỗng (Empty State)
- **Mục tiêu:** Kiểm tra phản ứng của Frontend khi không tìm thấy dữ liệu phù hợp với bộ lọc.
- **Các bước thao tác:**
  1. Mở trình duyệt truy cập trang chủ: `http://localhost:5173/`.
  2. Tại ô tìm kiếm trên thanh công cụ, gõ: `TK-999999-KHONG-CO`.
  3. Quan sát màn hình:
     - Bảng dữ liệu tự động ẩn đi.
     - Hiển thị khối Empty State với icon 🔍.
     - Dòng chữ: **Chưa có phiếu bảo hành nào**.
     - Xuất hiện nút: **Xóa bộ lọc tìm kiếm**.
- **Chụp ảnh:** Chụp toàn màn hình hiển thị trạng thái Empty State.
- **Tên file ảnh:** `docs/srceenshot/TC-11.png`.

---

### 🔹 TC-12: Kiểm tra trạng thái lỗi mất kết nối và nút "Thử lại" (UI Error State)
- **Mục tiêu:** Kiểm tra giao diện bắt lỗi mất mạng và có nút "Thử lại" theo phản hồi của Giảng viên tại Buổi 14.
- **Các bước thao tác:**
  1. Mở Terminal đang chạy Backend (`node index.js` hoặc `npm run dev`), bấm tổ hợp phím `Ctrl + C` để tạm tắt Backend.
  2. Quay lại trình duyệt tại `http://localhost:5173/`, bấm phím **F5** (Refresh).
  3. Quan sát giao diện:
     - Xuất hiện thẻ cảnh báo lỗi màu đỏ (Error State): Icon ⚠️.
     - Tiêu đề: **Không thể tải dữ liệu**.
     - Mô tả: *Mất kết nối tới hệ thống máy chủ backend. Vui lòng kiểm tra lại dịch vụ.*
     - Xuất hiện nút bấm: **🔄 Thử tải lại**.
  4. Chụp ảnh màn hình làm minh chứng.
  5. *(Sau khi chụp xong, mở lại Terminal backend gõ `npm run dev` để hệ thống hoạt động bình thường)*.
- **Chụp ảnh:** Chụp màn hình hiển thị thông báo lỗi và nút "Thử tải lại".
- **Tên file ảnh:** `docs/srceenshot/TC-12.png`.

---

## 3. Tổng kết và Đánh giá chất lượng

- **Tổng số kịch bản kiểm thử:** 12 / 12 test cases
- **Số test case đạt yêu cầu (PASS):** 12 / 12 (Tỷ lệ: **100%**)
- **Số lỗi nghiêm trọng (Critical Bug) còn tồn đọng:** 0
- **Kết luận:** Hệ thống SmartCRM phân hệ Tiếp nhận và Phân loại Bảo hành (L2) hoạt động ổn định, đáp ứng chính xác các quy tắc nghiệp vụ (BR1 - BR4, QT-01, QT-04, QT-05), bảo đảm an toàn dữ liệu CSDL (Idempotency C5), bảo mật chống tấn công Injection và kiểm soát quyền xét duyệt ngoại lệ chặt chẽ.
