require('dotenv').config();
const express = require('express');
const cors = require('cors');

require('./config/db'); 

const app = express();
app.use(cors());
app.use(express.json());

const ticketRoutes = require('./routes/ticketRoutes');
app.use('/api/tickets', ticketRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'SmartCRM Backend is running' });
});

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});