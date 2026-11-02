import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import TicketListPage from './pages/TicketListPage';
import ReceiveDevicePage from './pages/ReceiveDevicePage';
import TicketApprovalPage from './pages/TicketApprovalPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* Thanh điều hướng chính (Top Navigation Bar) */}
        <header className="app-navbar">
          <div className="navbar-container">
            <div className="navbar-brand">
              <div className="brand-logo">
                <span className="brand-icon">🛡️</span>
                <div>
                  <div className="brand-title">SmartCRM</div>
                  <div className="brand-subtitle">Phân hệ Tiếp nhận & Phân loại Bảo hành (L2)</div>
                </div>
              </div>
            </div>

            <nav className="navbar-nav">
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
              >
                <span className="nav-icon">📋</span>
                <span>Danh sách phiếu</span>
              </NavLink>

              <NavLink 
                to="/tiep-nhan" 
                className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
              >
                <span className="nav-icon">🔍</span>
                <span>Tra cứu & Tiếp nhận</span>
              </NavLink>

              <NavLink 
                to="/xet-duyet" 
                className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
              >
                <span className="nav-icon">⚖️</span>
                <span>Xét duyệt ngoại lệ</span>
              </NavLink>
            </nav>

            <div className="navbar-user">
              <div className="user-badge">
                <span className="user-avatar">👨‍💻</span>
                <div className="user-info">
                  <span className="user-name">Nguyễn Tấn Hoàng Thông</span>
                  <span className="user-role">MSSV: 2374802010485 (SE)</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Nội dung ứng dụng */}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<TicketListPage />} />
            <Route path="/tiep-nhan" element={<ReceiveDevicePage />} />
            <Route path="/xet-duyet" element={<TicketApprovalPage ticketId="TK-2026-002" />} />
          </Routes>
        </main>

        {/* Chân trang */}
        <footer className="app-footer">
          <div className="footer-container">
            <span>Chuyên đề Tốt nghiệp 1 – Khoa Công nghệ Thông tin – Trường Đại học Văn Lang</span>
            <span>Phiên bản SmartCRM v2.4 (CRUD & Modern UI Edition)</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
