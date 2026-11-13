# TÀI LIỆU KỸ THUẬT API (API DOCUMENTATION)
**Phân hệ:** Tiếp nhận và Phân loại Bảo hành (L2)
**Dự án:** SmartCRM

---

## 1. Danh sách mã lỗi chung (Trích xuất từ kết quả Test thực tế)
*Bảng mã lỗi này khớp 100% với các test case dữ liệu sai (TC-06, TC-07, TC-09) trong Test Report.*

| HTTP Status | Mã lỗi nội bộ | Mô tả chi tiết | Test Case liên quan |
| :--- | :--- | :--- | :--- |
| **400** | `BAD_REQUEST` | Lỗi dữ liệu đầu vào (ví dụ: mô tả quá ngắn vi phạm BR4, lỗi khóa ngoại DB). | TC-06, TC-07 |
| **401** | `UNAUTHORIZED` | Thiếu token hoặc token không hợp lệ. | N/A |
| **403** | `FORBIDDEN` | Tài khoản không có quyền thao tác (VD: Tiếp tân gọi API duyệt ngoại lệ). | TC-08 |
| **404** | `NOT_FOUND` | Không tìm thấy tài nguyên (VD: Không tìm thấy khách hàng/thiết bị). | TC-09 |
| **500** | `SERVER_ERROR` | Lỗi máy chủ hoặc mất kết nối DB. | TC-12 |

---

## 2. Chi tiết các Endpoints (Đầy đủ 7 mục)

### 2.1. Tra cứu khách hàng theo số điện thoại
1. **Tên API:** Lấy thông tin khách hàng (Tìm kiếm).
2. **Method & URL:** `GET /api/customers`
3. **Xác thực (Token):** Cần có `Bearer Token` ở Header.
4. **Phân quyền (Roles):** `TiepTan` (Tiếp tân), `QuanLy` (Quản lý cửa hàng).
5. **Request (Params/Query):**
   * Query Param: `phone` (String, bắt buộc) - Số điện thoại cần tra cứu.
   * Ví dụ: `/api/customers?phone=0988765432`
6. **Ví dụ Response (Chạy thật - Thành công 200 OK):**
   ```json
   {
     "status": "success",
     "data": [
       {
         "customer_id": 1,
         "full_name": "Trần Thị Bình",
         "phone": "0988765432",
         "tier": "VIP",
         "created_at": "2024-01-15T08:00:00Z"
       }
     ]
   }
   ```
7. **Ví dụ Response (Chạy thật - Lỗi 404 Không tìm thấy / TC-09 SQL Injection):**
   ```json
   {
     "status": "error",
     "error_code": "NOT_FOUND",
     "message": "Không tìm thấy khách hàng"
   }
   ```

---

### 2.2. Tra cứu trạng thái bảo hành thiết bị
1. **Tên API:** Kiểm tra thông tin máy và đối soát hạn bảo hành.
2. **Method & URL:** `GET /api/devices/serial/:serialNumber`
3. **Xác thực (Token):** Cần có `Bearer Token` ở Header.
4. **Phân quyền (Roles):** `TiepTan`, `QuanLy`.
5. **Request (Params):**
   * Path Param: `serialNumber` (String, bắt buộc) - Mã định danh thiết bị.
6. **Ví dụ Response (Chạy thật - Thành công 200 OK - TC-02 Hợp lệ):**
   ```json
   {
     "status": "success",
     "data": {
       "device_id": 101,
       "serial_number": "SN-IP-1122334",
       "purchase_date": "2026-01-01",
       "warranty_months": 12,
       "is_valid": true,
       "days_remaining": 328
     }
   }
   ```
7. **Ví dụ Response (Chạy thật - Lỗi 400 Hết hạn - TC-05):**
   ```json
   {
     "status": "warning",
     "is_valid": false,
     "message": "🔴 Thiết bị đã hết hạn bảo hành (QT-01)"
   }
   ```

---

### 2.3. Khởi tạo phiếu tiếp nhận bảo hành
1. **Tên API:** Tạo mới phiếu tiếp nhận.
2. **Method & URL:** `POST /api/tickets`
3. **Xác thực (Token):** Cần có `Bearer Token`.
4. **Phân quyền (Roles):** `TiepTan`, `QuanLy`.
5. **Request (Body - JSON):**
   ```json
   {
     "customer_id": 1,
     "device_id": 101,
     "issue_desc": "Màn hình sọc đen mờ khi khởi động máy",
     "priority": "CAO"
   }
   ```
6. **Ví dụ Response (Chạy thật - Thành công 201 Created - TC-01):**
   ```json
   {
     "status": "success",
     "message": "Tạo phiếu tiếp nhận thành công",
     "data": {
       "ticket_id": "TK-2026-001",
       "status": "TIEP_NHAN",
       "sla_deadline": "2026-11-09T17:00:00Z"
     }
   }
   ```
7. **Ví dụ Response (Chạy thật - Lỗi 400 Bad Request - TC-07 Vi phạm khóa ngoại):**
   ```json
   {
     "status": "error",
     "error_code": "BAD_REQUEST",
     "message": "violates foreign key constraint \"ticket_customer_id_fkey\""
   }
   ```

---

### 2.4. Xét duyệt yêu cầu bảo hành ngoại lệ
1. **Tên API:** Phê duyệt phiếu bảo hành trễ hạn / vi phạm tiêu chuẩn.
2. **Method & URL:** `PUT /api/tickets/:ticket_id/approve`
3. **Xác thực (Token):** Cần có `Bearer Token`.
4. **Phân quyền (Roles):** **Chỉ `QuanLy` (Quản lý cửa hàng)**.
5. **Request (Params & Body):**
   * Path Param: `ticket_id` (String)
   * Body:
   ```json
   {
     "manager_note": "Đồng ý hỗ trợ khách VIP, miễn phí công sửa chữa, giảm 50% phí thay linh kiện."
   }
   ```
6. **Ví dụ Response (Chạy thật - Thành công 200 OK - TC-08):**
   ```json
   {
     "status": "success",
     "message": "Đã phê duyệt tiếp nhận",
     "data": {
       "ticket_id": "TK-2026-002",
       "status": "TIEP_NHAN",
       "approved_by": "QL_001"
     }
   }
   ```
7. **Ví dụ Response (Chạy thật - Lỗi 403 Forbidden - Tiếp tân gọi API):**
   ```json
   {
     "status": "error",
     "error_code": "FORBIDDEN",
     "message": "Bạn không có quyền thực hiện chức năng phê duyệt ngoại lệ."
   }
   ```