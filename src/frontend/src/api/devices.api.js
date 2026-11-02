import { request } from './client';

export const devicesApi = {
    // Tra cứu thông tin thiết bị theo Serial Number/IMEI
    traCuuSerial: (serial) => request(`/api/devices?serial=${encodeURIComponent(serial)}`),

    // Tra cứu thông tin khách hàng theo số điện thoại
    traCuuKhachHang: (phone) => request(`/api/customers?phone=${encodeURIComponent(phone)}`),
};

