const db = require('../config/db');

const getAllTickets = async () => {
    const result = await db.query('SELECT * FROM ticket ORDER BY received_at DESC');
    return result.rows;
};

const createTicket = async (ticketData) => {
    // ĐÃ SỬA: Lấy thêm due_date và status từ ticketData truyền xuống
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
            status || 'MỚI'
        ]
    );
    return result.rows[0];
};

module.exports = { getAllTickets, createTicket };