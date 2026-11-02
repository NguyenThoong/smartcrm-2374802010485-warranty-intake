const db = require('../config/db');

/**
 * Lấy danh sách tất cả phiếu bảo hành kèm thông tin Khách hàng, Thiết bị, Kỹ thuật viên
 */
const getAllTickets = async (filters = {}) => {
    let query = `
        SELECT 
            t.ticket_id,
            t.ticket_code,
            t.customer_id,
            t.device_id,
            t.technician_id,
            t.issue_desc,
            t.priority,
            t.status,
            t.received_at,
            t.due_date,
            t.closed_at,
            c.full_name AS customer_name,
            c.phone AS customer_phone,
            c.email AS customer_email,
            c.segment AS customer_segment,
            d.serial_no,
            d.purchase_date,
            d.warranty_months,
            tech.employee_id AS technician_code
        FROM ticket t
        LEFT JOIN customer c ON t.customer_id = c.customer_id
        LEFT JOIN device d ON t.device_id = d.device_id
        LEFT JOIN technician tech ON t.technician_id = tech.technician_id
        WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
        params.push(filters.status);
        query += ` AND t.status = $${params.length}`;
    }
    if (filters.priority) {
        params.push(filters.priority);
        query += ` AND t.priority = $${params.length}`;
    }
    if (filters.search) {
        params.push(`%${filters.search}%`);
        query += ` AND (t.ticket_code ILIKE $${params.length} OR d.serial_no ILIKE $${params.length} OR c.full_name ILIKE $${params.length} OR c.phone ILIKE $${params.length})`;
    }

    query += ' ORDER BY t.received_at DESC';

    const result = await db.query(query, params);
    return result.rows;
};

/**
 * Lấy chi tiết 1 phiếu bảo hành theo ticket_id hoặc ticket_code
 * Tránh lỗi 'operator does not exist: character varying = bigint' bằng cách tách riêng tham số BigInt và Varchar
 */
const getTicketById = async (id) => {
    const strId = String(id).trim();
    const isNumeric = /^\d+$/.test(strId);

    const baseQuery = `
        SELECT 
            t.ticket_id,
            t.ticket_code,
            t.customer_id,
            t.device_id,
            t.technician_id,
            t.issue_desc,
            t.priority,
            t.status,
            t.received_at,
            t.due_date,
            t.closed_at,
            c.full_name AS customer_name,
            c.phone AS customer_phone,
            c.email AS customer_email,
            c.segment AS customer_segment,
            d.serial_no,
            d.purchase_date,
            d.warranty_months,
            tech.employee_id AS technician_code
        FROM ticket t
        LEFT JOIN customer c ON t.customer_id = c.customer_id
        LEFT JOIN device d ON t.device_id = d.device_id
        LEFT JOIN technician tech ON t.technician_id = tech.technician_id
    `;

    if (isNumeric) {
        // Dùng 2 tham số riêng: $1 (bigint) so sánh với t.ticket_id, $2 (varchar/text) so sánh với t.ticket_code
        const query = `${baseQuery} WHERE t.ticket_id = $1 OR t.ticket_code = $2`;
        const result = await db.query(query, [parseInt(strId, 10), strId]);
        return result.rows[0];
    } else {
        const query = `${baseQuery} WHERE t.ticket_code = $1`;
        const result = await db.query(query, [strId]);
        return result.rows[0];
    }
};

/**
 * Lấy nhật ký chuyển trạng thái của phiếu
 */
const getStatusLogsByTicketId = async (ticketId) => {
    const idVal = parseInt(String(ticketId).trim(), 10);
    if (isNaN(idVal)) return [];

    const result = await db.query(
        'SELECT * FROM ticket_status_log WHERE ticket_id = $1 ORDER BY changed_at ASC',
        [idVal]
    );
    return result.rows;
};

/**
 * Ghi log chuyển trạng thái
 */
const addStatusLog = async (ticketId, fromStatus, toStatus, changedBy) => {
    const idVal = parseInt(String(ticketId).trim(), 10);
    const result = await db.query(
        `INSERT INTO ticket_status_log (ticket_id, from_status, to_status, changed_by)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [idVal, fromStatus, toStatus, changedBy || 'Tiếp tân']
    );
    return result.rows[0];
};

/**
 * Khởi tạo phiếu bảo hành mới (Create)
 */
const createTicket = async (ticketData) => {
    const { ticket_code, customer_id, device_id, issue_desc, priority, due_date, status } = ticketData;
    
    const result = await db.query(
        `INSERT INTO ticket (ticket_code, customer_id, device_id, issue_desc, priority, due_date, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
            ticket_code, 
            customer_id, 
            device_id, 
            issue_desc, 
            priority || 'TRUNG_BINH', 
            due_date, 
            status || 'TIEP_NHAN'
        ]
    );
    return result.rows[0];
};

/**
 * Cập nhật phiếu bảo hành (Update)
 */
const updateTicket = async (ticketId, updateData) => {
    const { issue_desc, priority, status, closed_at } = updateData;
    const idVal = parseInt(String(ticketId).trim(), 10);

    const result = await db.query(
        `UPDATE ticket 
         SET issue_desc = $1, priority = $2, status = $3, closed_at = $4
         WHERE ticket_id = $5 
         RETURNING *`,
        [issue_desc, priority, status, closed_at, idVal]
    );
    return result.rows[0];
};

/**
 * Xóa phiếu bảo hành (Delete) - Lịch sử trạng thái được xóa cascade theo cấu trúc schema
 */
const deleteTicket = async (ticketId) => {
    const idVal = parseInt(String(ticketId).trim(), 10);

    const result = await db.query(
        'DELETE FROM ticket WHERE ticket_id = $1 RETURNING *',
        [idVal]
    );
    return result.rows[0];
};

module.exports = { 
    getAllTickets, 
    getTicketById, 
    getStatusLogsByTicketId, 
    addStatusLog, 
    createTicket, 
    updateTicket, 
    deleteTicket 
};
