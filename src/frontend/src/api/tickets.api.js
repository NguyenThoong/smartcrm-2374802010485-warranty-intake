import { request } from './client';

export const ticketsApi = {
    danhSach: () => request('/api/tickets'),
    tiepNhan: (payload) => request('/api/tickets', { method: 'POST', body: JSON.stringify(payload) }),
};