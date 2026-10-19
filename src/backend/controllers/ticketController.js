const ticketService = require('../services/ticketService');

const getAll = async (req, res) => {
    try {
        const tickets = await ticketService.getTickets();
        res.status(200).json({ success: true, data: tickets });
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

module.exports = { getAll, create };