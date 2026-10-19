const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.get('/', ticketController.getAll);
router.post('/', ticketController.create);

module.exports = router;