require('dotenv').config();
const express = require('express');
const cors = require('cors');

require('./config/db'); 

const app = express();
app.use(cors());
app.use(express.json());

// Khai báo API Phiếu bảo hành
const ticketRoutes = require('./routes/ticketRoutes');
app.use('/api/tickets', ticketRoutes);

// MỚI THÊM: Khai báo API Khách hàng
const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'SmartCRM Backend is running' });
});

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});