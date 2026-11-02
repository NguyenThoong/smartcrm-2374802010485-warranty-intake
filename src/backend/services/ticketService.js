const ticketRepo = require('../repositories/ticketRepository');

/**
 * Lấy danh sách phiếu bảo hành (hỗ trợ filter)
 */
const getTickets = async (filters = {}) => {
    return await ticketRepo.getAllTickets(filters);
};

/**
 * Lấy chi tiết phiếu bảo hành kèm lịch sử trạng thái
 */
const getTicketById = async (id) => {
    const ticket = await ticketRepo.getTicketById(id);
    if (!ticket) return null;
    
    let logs = [];
    if (typeof ticketRepo.getStatusLogsByTicketId === 'function') {
        logs = await ticketRepo.getStatusLogsByTicketId(ticket.ticket_id);
    }
    return { ...ticket, logs: logs || [] };
};

/**
 * Khởi tạo phiếu tiếp nhận mới (Create)
 * Giữ nguyên 100% logic nghiệp vụ hiện tại:
 * - SLA +3 ngày
 * - Mô tả < 10 ký tự tự động cảnh báo
 * - Mức độ ưu tiên chuẩn hóa
 * - Trạng thái TIEP_NHAN
 */
const createNewTicket = async (data) => {
    let description = data.issue_desc || data.issueDesc || '';

    if (description.length < 10) {
        description = 'Sự cố thiết bị: ' + description + ' (Cần kiểm tra kỹ)';
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);
    const formattedDueDate = dueDate.toISOString();

    // Ánh xạ mức độ ưu tiên sang đúng chuẩn Check Constraint của CSDL
    let priorityVal = data.priority || 'TRUNG_BINH';
    if (priorityVal === 'Cao' || priorityVal === 'CAO') priorityVal = 'CAO';
    else if (priorityVal === 'Trung bình' || priorityVal === 'TRUNG_BINH') priorityVal = 'TRUNG_BINH';
    else if (priorityVal === 'Thấp' || priorityVal === 'THAP') priorityVal = 'THAP';

    const ticketData = {
        ticket_code: `TK-${Date.now().toString().slice(-6)}`,
        customer_id: data.customer_id || data.customerId,
        device_id: data.device_id || data.deviceId || 1,
        issue_desc: description,
        priority: priorityVal,
        status: 'TIEP_NHAN',
        due_date: formattedDueDate
    };

    const created = await ticketRepo.createTicket(ticketData);

    // Ghi nhật ký ban đầu nếu hàm có sẵn (bọc try-catch để an toàn cho unit test mock)
    try {
        if (created && created.ticket_id && typeof ticketRepo.addStatusLog === 'function') {
            await ticketRepo.addStatusLog(created.ticket_id, null, 'TIEP_NHAN', 'Tiếp tân');
        }
    } catch {
        // Không làm ngắt quãng nếu log lỗi
    }

    return created;
};

/**
 * Cập nhật thông tin phiếu bảo hành (Update)
 * Tuân thủ các quy tắc ràng buộc CSDL và nghiệp vụ:
 * - issue_desc tối thiểu 10 ký tự
 * - priority thuộc ('CAO', 'TRUNG_BINH', 'THAP')
 * - status thuộc ('TIEP_NHAN', 'CHO_DUYET', 'DA_BAN_GIAO', 'DANG_SUA', 'HOAN_TAT', 'TU_CHOI')
 * - Ghi log trạng thái khi có thay đổi
 */
const updateTicket = async (id, data) => {
    const currentTicket = await ticketRepo.getTicketById(id);
    if (!currentTicket) {
        return null;
    }

    // 1. Kiểm tra mô tả lỗi nếu có chỉnh sửa
    let description = data.issue_desc !== undefined ? data.issue_desc : currentTicket.issue_desc;
    if (description && description.trim().length < 10) {
        throw new Error('Mô tả sự cố (issue_desc) bắt buộc phải có độ dài tối thiểu từ 10 ký tự trở lên (BR4).');
    }

    // 2. Chuẩn hóa mức ưu tiên
    let priorityVal = currentTicket.priority;
    if (data.priority) {
        const p = String(data.priority).toUpperCase().trim();
        if (p === 'CAO') priorityVal = 'CAO';
        else if (p === 'TRUNG_BINH' || p === 'TRUNG BÌNH') priorityVal = 'TRUNG_BINH';
        else if (p === 'THAP' || p === 'THẤP') priorityVal = 'THAP';
        else throw new Error('Mức độ ưu tiên không hợp lệ (Chỉ chấp nhận: CAO, TRUNG_BINH, THAP).');
    }

    // 3. Chuẩn hóa trạng thái
    const allowedStatuses = ['TIEP_NHAN', 'CHO_DUYET', 'DA_BAN_GIAO', 'DANG_SUA', 'HOAN_TAT', 'TU_CHOI'];
    let statusVal = currentTicket.status;
    if (data.status) {
        const s = String(data.status).trim();
        if (!allowedStatuses.includes(s)) {
            throw new Error(`Trạng thái không hợp lệ. Chỉ chấp nhận: ${allowedStatuses.join(', ')}.`);
        }
        statusVal = s;
    }

    // 4. Xử lý thời gian đóng phiếu (closed_at)
    let closedAt = currentTicket.closed_at;
    if (statusVal === 'HOAN_TAT' || statusVal === 'TU_CHOI') {
        if (!closedAt) closedAt = new Date().toISOString();
    } else {
        closedAt = null;
    }

    const updated = await ticketRepo.updateTicket(currentTicket.ticket_id, {
        issue_desc: description,
        priority: priorityVal,
        status: statusVal,
        closed_at: closedAt
    });

    // 5. Ghi nhận log thay đổi nếu trạng thái thay đổi
    if (currentTicket.status !== statusVal && typeof ticketRepo.addStatusLog === 'function') {
        const changedBy = data.changed_by || 'Nhân viên hệ thống';
        try {
            await ticketRepo.addStatusLog(currentTicket.ticket_id, currentTicket.status, statusVal, changedBy);
        } catch {
            // Không làm sập ứng dụng nếu log thất bại
        }
    }

    return updated;
};

/**
 * Xóa phiếu bảo hành (Delete)
 */
const deleteTicket = async (id) => {
    const currentTicket = await ticketRepo.getTicketById(id);
    if (!currentTicket) {
        return null;
    }
    return await ticketRepo.deleteTicket(currentTicket.ticket_id);
};

module.exports = { 
    getTickets, 
    getTicketById, 
    createNewTicket, 
    updateTicket, 
    deleteTicket 
};
