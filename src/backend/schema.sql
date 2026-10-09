-- DDL Skeleton cho Luồng L2: Tiếp nhận và Phân loại Bảo hành
-- Hệ quản trị CSDL: PostgreSQL

-- 1. Bảng Khách hàng
CREATE TABLE IF NOT EXISTS customer (
    customer_id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(120),
    segment VARCHAR(20) NOT NULL DEFAULT 'MOI' 
        CHECK (segment IN ('VIP', 'THUONG_XUYEN', 'MOI', 'NGU_DONG')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Bảng Thiết bị
CREATE TABLE IF NOT EXISTS device (
    device_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customer(customer_id) ON DELETE RESTRICT,
    serial_no VARCHAR(50) NOT NULL UNIQUE,
    purchase_date DATE NOT NULL,
    warranty_months INT NOT NULL CHECK (warranty_months >= 0)
);

-- 3. Bảng Kỹ thuật viên
CREATE TABLE IF NOT EXISTS technician (
    technician_id BIGSERIAL PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL UNIQUE,
    center_id BIGINT NOT NULL,
    level VARCHAR(20) NOT NULL DEFAULT 'L1' CHECK (level IN ('L1', 'L2', 'L3')),
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 4. Bảng Phiếu bảo hành (Ticket)
CREATE TABLE IF NOT EXISTS ticket (
    ticket_id BIGSERIAL PRIMARY KEY,
    ticket_code VARCHAR(20) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL REFERENCES customer(customer_id) ON DELETE RESTRICT,
    device_id BIGINT NOT NULL REFERENCES device(device_id) ON DELETE RESTRICT,
    technician_id BIGINT REFERENCES technician(technician_id) ON DELETE SET NULL,
    issue_desc TEXT NOT NULL CHECK (length(issue_desc) >= 10),
    priority VARCHAR(20) NOT NULL DEFAULT 'TRUNG_BINH' 
        CHECK (priority IN ('CAO', 'TRUNG_BINH', 'THAP')),
    status VARCHAR(20) NOT NULL DEFAULT 'TIEP_NHAN' 
        CHECK (status IN ('TIEP_NHAN', 'CHO_DUYET', 'DA_BAN_GIAO', 'DANG_SUA', 'HOAN_TAT', 'TU_CHOI')),
    received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    due_date TIMESTAMPTZ NOT NULL,
    closed_at TIMESTAMPTZ,
    CONSTRAINT chk_closed_after_received CHECK (closed_at IS NULL OR closed_at >= received_at)
);

-- 5. Bảng Lịch sử chuyển trạng thái
CREATE TABLE IF NOT EXISTS ticket_status_log (
    log_id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES ticket(ticket_id) ON DELETE CASCADE,
    from_status VARCHAR(20),
    to_status VARCHAR(20) NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    changed_by VARCHAR(50) NOT NULL
);

-- Các INDEX tối ưu hiệu năng (Phục vụ trực tiếp NFR1)
CREATE INDEX IF NOT EXISTS idx_customer_phone ON customer(phone);
CREATE INDEX IF NOT EXISTS idx_device_serial ON device(serial_no);
CREATE INDEX IF NOT EXISTS idx_ticket_status_due ON ticket(status, due_date);
CREATE INDEX IF NOT EXISTS idx_log_ticket ON ticket_status_log(ticket_id, changed_at);