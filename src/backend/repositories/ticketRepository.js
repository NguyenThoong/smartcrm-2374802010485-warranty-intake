const db = require('../config/db');

const getAllTickets = async () => {
    const result = await db.query('SELECT * FROM ticket ORDER BY received_at DESC');
    return result.rows;
};

const createTicket = async (ticketData) => {
    const { ticket_code, customer_id, device_id, issue_desc, priority } = ticketData;
    const result = await db.query(
        `INSERT INTO ticket (ticket_code, customer_id, device_id, issue_desc, priority) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [ticket_code, customer_id, device_id, issue_desc, priority || 'TRUNG_BINH']
    );
    return result.rows[0];
};

module.exports = { getAllTickets, createTicket };