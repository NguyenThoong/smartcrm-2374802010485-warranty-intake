const customerRepository = require('../repositories/customerRepository');

exports.searchByPhone = async (req, res, next) => {
    try {
        const { phone } = req.query;
        if (!phone) {
            return res.status(400).json({ error: 'BAD_REQUEST', message: 'Thiếu số điện thoại' });
        }
        const customer = await customerRepository.findByPhone(phone);
        if (!customer) {
            return res.status(404).json({ error: 'NOT_FOUND', message: 'Không tìm thấy khách hàng' });
        }
        res.status(200).json(customer);
    } catch (error) {
        next(error); 
    }
};