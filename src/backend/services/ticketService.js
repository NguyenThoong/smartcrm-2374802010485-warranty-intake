const ticketRepo = require('../repositories/ticketRepository');

const getTickets = async () => {
    return await ticketRepo.getAllTickets();
};

const createNewTicket = async (data) => {
    if (!data.issue_desc || data.issue_desc.length < 10) {
        throw new Error('Mô tả sự cố phải có tối thiểu 10 ký tự.');
    }
    data.ticket_code = `TK-${Date.now().toString().slice(-6)}`;
    return await ticketRepo.createTicket(data);
};

module.exports = { getTickets, createNewTicket };