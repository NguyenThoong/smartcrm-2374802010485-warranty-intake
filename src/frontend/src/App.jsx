import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TicketListPage from './pages/TicketListPage';
import ReceiveDevicePage from './pages/ReceiveDevicePage';
import TicketApprovalPage from './pages/TicketApprovalPage';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '15px', backgroundColor: '#f4f4f4', marginBottom: '20px', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', fontWeight: 'bold' }}>Danh sách phiếu</Link>
        <Link to="/tiep-nhan" style={{ marginRight: '20px', textDecoration: 'none', fontWeight: 'bold' }}>Tạo phiếu mới</Link>
        <Link to="/xet-duyet" style={{ textDecoration: 'none', fontWeight: 'bold' }}>Xét duyệt ngoại lệ</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<TicketListPage />} />
        <Route path="/tiep-nhan" element={<ReceiveDevicePage />} />
        <Route path="/xet-duyet" element={<TicketApprovalPage ticketId="TK-2026-002" />} />
      </Routes>
    </BrowserRouter>
  );
}