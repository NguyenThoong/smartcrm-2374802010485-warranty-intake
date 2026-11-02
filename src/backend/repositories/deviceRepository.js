const db = require('../config/db');

/**
 * Tìm thiết bị theo số Serial/IMEI, kèm thông tin khách hàng
 */
const findBySerial = async (serialNo) => {
    const result = await db.query(
        `SELECT 
            d.device_id,
            d.customer_id,
            d.serial_no,
            d.purchase_date,
            d.warranty_months,
            c.full_name AS customer_name,
            c.phone AS customer_phone,
            c.email AS customer_email,
            c.segment AS customer_segment
         FROM device d
         LEFT JOIN customer c ON d.customer_id = c.customer_id
         WHERE UPPER(d.serial_no) = UPPER($1)`,
        [String(serialNo).trim()]
    );
    return result.rows[0];
};

/**
 * Tìm danh sách phiếu bảo hành đã có của thiết bị
 */
const findTicketsByDeviceId = async (deviceId) => {
    const idVal = parseInt(String(deviceId).trim(), 10);
    if (isNaN(idVal)) return [];

    const result = await db.query(
        `SELECT ticket_id, ticket_code, status, priority, issue_desc, received_at, due_date
         FROM ticket 
         WHERE device_id = $1 
         ORDER BY received_at DESC`,
        [idVal]
    );
    return result.rows;
};

module.exports = { findBySerial, findTicketsByDeviceId };
