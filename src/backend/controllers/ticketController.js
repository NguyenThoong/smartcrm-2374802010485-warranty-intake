const ticketService = require('../services/ticketService');

const getAll = async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            priority: req.query.priority,
            search: req.query.search || req.query.ticketCode
        };
        const tickets = await ticketService.getTickets(filters);
        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const ticket = await ticketService.getTicketById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy phiếu bảo hành' });
        }
        res.status(200).json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const newTicket = await ticketService.createNewTicket(req.body);
        res.status(201).json({ success: true, data: newTicket });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const updated = await ticketService.updateTicket(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy phiếu bảo hành để cập nhật' });
        }
        res.status(200).json({ success: true, data: updated, message: 'Cập nhật phiếu thành công' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const deleted = await ticketService.deleteTicket(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy phiếu bảo hành để xóa' });
        }
        res.status(200).json({ 
            success: true, 
            data: deleted, 
            message: `Đã xóa phiếu bảo hành ${deleted.ticket_code || ''} thành công` 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getAll, getById, create, update, remove };
