const BASE = 'http://localhost:3000';

export class ApiError extends Error {
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

export async function request(path, options = {}) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (res.status === 204) return null;
    let body = null;
    try { body = await res.json(); } catch { /* ignore */ }

    if (!res.ok) {
        // ĐÃ SỬA: Lấy trực tiếp thông báo lỗi từ body.error hoặc body.message để hiển thị chuẩn xác
        const errorMsg = body?.error || body?.message || 'Không kết nối được tới hệ thống. Vui lòng thử lại.';
        throw new ApiError(res.status, body?.code, errorMsg);
    }
    return body?.data ?? body;
}