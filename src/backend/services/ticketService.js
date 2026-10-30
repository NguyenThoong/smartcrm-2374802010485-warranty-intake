const ticketRepo = require('../repositories/ticketRepository');

const getTickets = async () => {
    return await ticketRepo.getAllTickets();
};

const createNewTicket = async (data) => {
    let description = data.issue_desc || data.issueDesc || '';

    if (description.length < 10) {
        description = 'Sự cố thiết bị: ' + description + ' (Cần kiểm tra kỹ)';
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);
    const formattedDueDate = dueDate.toISOString(); // Giữ chuẩn TIMESTAMPTZ nếu cần

    // Ánh xạ mức độ ưu tiên sang đúng chuẩn Check Constraint của CSDL
    let priorityVal = data.priority || 'TRUNG_BINH';
    if (priorityVal === 'Cao' || priorityVal === 'CAO') priorityVal = 'CAO';
    else if (priorityVal === 'Trung bình' || priorityVal === 'TRUNG_BINH') priorityVal = 'TRUNG_BINH';
    else if (priorityVal === 'Thấp' || priorityVal === 'THAP') priorityVal = 'THAP';

    const ticketData = {
        ticket_code: `TK-${Date.now().toString().slice(-6)}`,
        customer_id: data.customer_id || data.customerId,
        device_id: data.device_id || 1,
        issue_desc: description,
        priority: priorityVal,
        status: 'TIEP_NHAN', // KHỚP 100% VỚI CHECK CONSTRAINT TRONG SCHEMA.SQL
        due_date: formattedDueDate
    };

    return await ticketRepo.createTicket(ticketData);
};

module.exports = { getTickets, createNewTicket };