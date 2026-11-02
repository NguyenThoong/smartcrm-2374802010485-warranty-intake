const deviceRepo = require('../repositories/deviceRepository');

/**
 * Tra cứu thông tin thiết bị theo Serial Number/IMEI
 * Tính toán trạng thái bảo hành chính hãng và trả về các phiếu bảo hành đã có
 */
const lookupBySerial = async (serialNo) => {
    if (!serialNo) return null;

    const device = await deviceRepo.findBySerial(serialNo);
    if (!device) return null;

    // Tính toán hạn bảo hành
    const purchaseDate = new Date(device.purchase_date);
    const expireDate = new Date(purchaseDate);
    expireDate.setMonth(expireDate.getMonth() + Number(device.warranty_months || 0));

    const now = new Date();
    const isValid = now <= expireDate;
    const diffTime = Math.abs(expireDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const warrantyInfo = {
        purchaseDate: device.purchase_date,
        warrantyMonths: device.warranty_months,
        expireDate: expireDate.toISOString().split('T')[0],
        isValid,
        status: isValid ? 'CON_HAN' : 'HET_HAN',
        diffDays,
        message: isValid
            ? `Thiết bị còn hạn bảo hành hợp lệ (Còn ${diffDays} ngày)`
            : `Thiết bị đã hết hạn bảo hành chính hãng (Quá hạn ${diffDays} ngày)`
    };

    // Kiểm tra các phiếu bảo hành đã có của thiết bị
    const previousTickets = await deviceRepo.findTicketsByDeviceId(device.device_id);

    return {
        ...device,
        warrantyInfo,
        previousTickets: previousTickets || []
    };
};

module.exports = { lookupBySerial };

