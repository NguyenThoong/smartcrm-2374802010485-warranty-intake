import { request } from './client';

export const ticketsApi = {
    // R: Lấy danh sách phiếu (hỗ trợ filter status, priority, search)
    danhSach: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
        if (filters.ticketCode) params.append('search', filters.ticketCode);
        if (filters.search) params.append('search', filters.search);

        const qs = params.toString();
        return request(`/api/tickets${qs ? `?${qs}` : ''}`);
    },

    // R: Xem chi tiết 1 phiếu bảo hành kèm lịch sử trạng thái
    chiTiet: (id) => request(`/api/tickets/${id}`),

    // C: Tiếp nhận / Tạo mới phiếu bảo hành
    tiepNhan: (payload) => request('/api/tickets', { 
        method: 'POST', 
        body: JSON.stringify(payload) 
    }),

    // U: Cập nhật thông tin phiếu bảo hành (mô tả lỗi, mức độ ưu tiên, trạng thái)
    capNhat: (id, payload) => request(`/api/tickets/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(payload) 
    }),

    // D: Xóa phiếu bảo hành
    xoa: (id) => request(`/api/tickets/${id}`, { 
        method: 'DELETE' 
    })
};
