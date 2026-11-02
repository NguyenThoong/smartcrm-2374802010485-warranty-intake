const deviceService = require('../services/deviceService');

const searchBySerial = async (req, res) => {
    try {
        const { serial } = req.query;
        if (!serial) {
            return res.status(400).json({ error: 'BAD_REQUEST', message: 'Vui lòng cung cấp số Serial Number/IMEI' });
        }
        const data = await deviceService.lookupBySerial(serial);
        if (!data) {
            return res.status(404).json({ error: 'NOT_FOUND', message: 'Không tìm thấy thiết bị với số Serial/IMEI này trong hệ thống' });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: 'INTERNAL_ERROR', message: error.message });
    }
};

module.exports = { searchBySerial };

