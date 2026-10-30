const db = require('../config/db');

exports.findByPhone = async (phone) => {
    const result = await db.query('SELECT * FROM customer WHERE phone = $1', [phone]);
    return result.rows[0]; 
};