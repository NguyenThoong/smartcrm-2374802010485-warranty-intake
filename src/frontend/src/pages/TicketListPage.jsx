import { useState, useMemo } from 'react';
import { useTickets } from '../hooks/useTickets';
import { DataState } from '../components/DataState';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { TicketDetailModal } from '../components/TicketDetailModal';
import { TicketEditModal } from '../components/TicketEditModal';
import { TicketDeleteModal } from '../components/TicketDeleteModal';
import { Toast } from '../components/Toast';
import { Link } from 'react-router-dom';

export default function TicketListPage() {
    // Bộ lọc
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Quản lý Modal & Toasts
    const [detailTicketId, setDetailTicketId] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [editingTicket, setEditingTicket] = useState(null);
    const [deletingTicket, setDeletingTicket] = useState(null);
    const [toast, setToast] = useState(null);

    // Tải dữ liệu từ backend
    const { data: rawTickets, loading, error, refetch } = useTickets({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        search: searchQuery || undefined
    });

    // Lọc phía Client để phản hồi tức thì
    const filteredTickets = useMemo(() => {
        if (!rawTickets || !Array.isArray(rawTickets)) return [];
        return rawTickets.filter(ticket => {
            const matchSearch = !searchQuery || 
                (ticket.ticket_code && ticket.ticket_code.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (ticket.serial_no && ticket.serial_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (ticket.customer_name && ticket.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (ticket.customer_phone && ticket.customer_phone.includes(searchQuery)) ||
                (ticket.issue_desc && ticket.issue_desc.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchStatus = !statusFilter || ticket.status === statusFilter;
            const matchPriority = !priorityFilter || ticket.priority === priorityFilter;

            return matchSearch && matchStatus && matchPriority;
        });
    }, [rawTickets, searchQuery, statusFilter, priorityFilter]);

    // Thống kê nhanh
    const stats = useMemo(() => {
        if (!rawTickets || !Array.isArray(rawTickets)) {
            return { total: 0, tiepNhan: 0, choDuyet: 0, dangXuLy: 0, hoanTat: 0 };
        }
        return {
            total: rawTickets.length,
            tiepNhan: rawTickets.filter(t => t.status === 'TIEP_NHAN').length,
            choDuyet: rawTickets.filter(t => t.status === 'CHO_DUYET').length,
            dangXuLy: rawTickets.filter(t => ['DA_BAN_GIAO', 'DANG_SUA'].includes(t.status)).length,
            hoanTat: rawTickets.filter(t => t.status === 'HOAN_TAT').length
        };
    }, [rawTickets]);

    // Dữ liệu phân trang
    const totalPages = Math.ceil(filteredTickets.length / pageSize) || 1;
    const paginatedTickets = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredTickets.slice(start, start + pageSize);
    }, [filteredTickets, currentPage, pageSize]);

    const handleResetFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
        setPriorityFilter('');
        setCurrentPage(1);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="page-container">
            {/* Toast thông báo */}
            <Toast toast={toast} onClose={() => setToast(null)} />

            {/* Header Dashboard */}
            <div className="page-header">
                <div>
                    <span className="badge-subtitle">Quản lý tiếp nhận dịch vụ (L2)</span>
                    <h1 className="page-title">Danh sách phiếu bảo hành</h1>
                    <p className="page-description">
                        Theo dõi, tra cứu, cập nhật tiến độ và quản lý toàn bộ vòng đời phiếu bảo hành trong hệ thống SmartCRM.
                    </p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-secondary" onClick={refetch} title="Làm mới dữ liệu">
                        🔄 Làm mới
                    </button>
                    <Link to="/tiep-nhan" className="btn btn-primary">
                        ➕ Tiếp nhận máy mới
                    </Link>
                </div>
            </div>

            {/* Thống kê chỉ số (Metric Cards) */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-icon bg-blue-light text-primary">📑</div>
                    <div className="metric-info">
                        <span className="metric-label">Tổng số phiếu</span>
                        <span className="metric-value">{stats.total}</span>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon bg-blue-light text-blue">📥</div>
                    <div className="metric-info">
                        <span className="metric-label">Mới tiếp nhận</span>
                        <span className="metric-value">{stats.tiepNhan}</span>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon bg-amber-light text-amber">⏳</div>
                    <div className="metric-info">
                        <span className="metric-label">Chờ duyệt ngoại lệ</span>
                        <span className="metric-value">{stats.choDuyet}</span>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon bg-cyan-light text-cyan">⚙️</div>
                    <div className="metric-info">
                        <span className="metric-label">Đang sửa / Chuyển Lab</span>
                        <span className="metric-value">{stats.dangXuLy}</span>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon bg-green-light text-green">✅</div>
                    <div className="metric-info">
                        <span className="metric-label">Đã hoàn tất</span>
                        <span className="metric-value">{stats.hoanTat}</span>
                    </div>
                </div>
            </div>

            {/* Thanh công cụ tìm kiếm và bộ lọc */}
            <div className="filter-card">
                <div className="filter-row">
                    <div className="filter-search-col">
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input 
                                type="text"
                                className="search-input"
                                placeholder="Tìm theo Mã phiếu, Serial Number, Tên hoặc SĐT khách..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            {searchQuery && (
                                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
                            )}
                        </div>
                    </div>

                    <div className="filter-select-col">
                        <select 
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="TIEP_NHAN">Tiếp nhận</option>
                            <option value="CHO_DUYET">Chờ duyệt ngoại lệ</option>
                            <option value="DA_BAN_GIAO">Đã bàn giao Lab</option>
                            <option value="DANG_SUA">Đang sửa chữa</option>
                            <option value="HOAN_TAT">Hoàn tất trả máy</option>
                            <option value="TU_CHOI">Từ chối bảo hành</option>
                        </select>
                    </div>

                    <div className="filter-select-col">
                        <select 
                            className="form-select"
                            value={priorityFilter}
                            onChange={(e) => {
                                setPriorityFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">Tất cả mức độ</option>
                            <option value="CAO">Ưu tiên Cao</option>
                            <option value="TRUNG_BINH">Ưu tiên Trung bình</option>
                            <option value="THAP">Ưu tiên Thấp</option>
                        </select>
                    </div>

                    {(searchQuery || statusFilter || priorityFilter) && (
                        <div className="filter-actions-col">
                            <button className="btn btn-outline" onClick={handleResetFilters}>
                                ✕ Xóa bộ lọc
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Vùng Bảng dữ liệu chính */}
            <div className="table-card">
                <DataState 
                    loading={loading} 
                    error={error} 
                    data={rawTickets}
                    onRetry={refetch}
                    empty={{ 
                        title: 'Chưa có phiếu bảo hành nào',
                        message: 'Không tìm thấy phiếu nào trong cơ sở dữ liệu hoặc khớp với bộ lọc hiện tại.',
                        action: (
                            <div className="empty-actions">
                                {(searchQuery || statusFilter || priorityFilter) ? (
                                    <button className="btn btn-secondary" onClick={handleResetFilters}>
                                        Xóa bộ lọc tìm kiếm
                                    </button>
                                ) : (
                                    <Link to="/tiep-nhan" className="btn btn-primary">
                                        Tạo phiếu tiếp nhận đầu tiên
                                    </Link>
                                )}
                            </div>
                        )
                    }}
                >
                    {() => {
                        if (filteredTickets.length === 0) {
                            return (
                                <div className="state-card empty-state">
                                    <div className="state-icon">🔍</div>
                                    <h4>Không có kết quả phù hợp</h4>
                                    <p className="state-desc">Không tìm thấy phiếu bảo hành nào khớp với điều kiện tìm kiếm hiện tại.</p>
                                    <button className="btn btn-secondary mt-2" onClick={handleResetFilters}>
                                        Đặt lại bộ lọc
                                    </button>
                                </div>
                            );
                        }

                        return (
                            <>
                                <div className="table-responsive">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '130px' }}>Mã phiếu</th>
                                                <th>Khách hàng</th>
                                                <th>Số Serial / IMEI</th>
                                                <th>Mô tả sự cố</th>
                                                <th style={{ width: '110px' }}>Mức độ</th>
                                                <th style={{ width: '160px' }}>Trạng thái</th>
                                                <th style={{ width: '110px' }}>Ngày nhận</th>
                                                <th style={{ width: '110px' }}>Hạn SLA</th>
                                                <th style={{ width: '180px', textAlign: 'center' }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedTickets.map(ticket => (
                                                <tr key={ticket.ticket_id} className="table-row-hover">
                                                    {/* Mã phiếu */}
                                                    <td>
                                                        <button 
                                                            className="ticket-code-btn"
                                                            onClick={() => {
                                                                setSelectedTicket(ticket);
                                                                setDetailTicketId(ticket.ticket_id);
                                                            }}
                                                            title="Bấm để xem chi tiết"
                                                        >
                                                            {ticket.ticket_code}
                                                        </button>
                                                    </td>

                                                    {/* Khách hàng */}
                                                    <td>
                                                        <div className="customer-info-cell">
                                                            <span className="customer-name">
                                                                {ticket.customer_name || `Khách hàng #${ticket.customer_id}`}
                                                            </span>
                                                            <span className="customer-sub">
                                                                {ticket.customer_phone ? `📞 ${ticket.customer_phone}` : `ID: ${ticket.customer_id}`}
                                                                {ticket.customer_segment && (
                                                                    <span className={`segment-pill segment-${ticket.customer_segment}`}>
                                                                        {ticket.customer_segment}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Serial / IMEI */}
                                                    <td>
                                                        <span className="serial-badge">
                                                            {ticket.serial_no || `Thiết bị #${ticket.device_id}`}
                                                        </span>
                                                    </td>

                                                    {/* Mô tả lỗi */}
                                                    <td>
                                                        <div className="issue-desc-cell" title={ticket.issue_desc}>
                                                            {ticket.issue_desc}
                                                        </div>
                                                    </td>

                                                    {/* Mức độ ưu tiên */}
                                                    <td>
                                                        <PriorityBadge priority={ticket.priority} />
                                                    </td>

                                                    {/* Trạng thái */}
                                                    <td>
                                                        <StatusBadge status={ticket.status} />
                                                    </td>

                                                    {/* Ngày tiếp nhận */}
                                                    <td className="text-muted text-sm">
                                                        {formatDate(ticket.received_at)}
                                                    </td>

                                                    {/* Hạn SLA */}
                                                    <td>
                                                        <span className="sla-badge font-mono text-sm">
                                                            {formatDate(ticket.due_date)}
                                                        </span>
                                                    </td>

                                                    {/* Cột Thao tác CRUD */}
                                                    <td>
                                                        <div className="action-buttons-group">
                                                            {/* R - Read */}
                                                            <button 
                                                                className="btn-action btn-action-view"
                                                                onClick={() => {
                                                                    setSelectedTicket(ticket);
                                                                    setDetailTicketId(ticket.ticket_id);
                                                                }}
                                                                title="Xem chi tiết phiếu (Read)"
                                                            >
                                                                👁️ Chi tiết
                                                            </button>

                                                            {/* U - Update */}
                                                            <button 
                                                                className="btn-action btn-action-edit"
                                                                onClick={() => setEditingTicket(ticket)}
                                                                title="Chỉnh sửa thông tin phiếu (Update)"
                                                            >
                                                                ✏️ Sửa
                                                            </button>

                                                            {/* D - Delete */}
                                                            <button 
                                                                className="btn-action btn-action-delete"
                                                                onClick={() => setDeletingTicket(ticket)}
                                                                title="Xóa phiếu bảo hành (Delete)"
                                                            >
                                                                🗑️ Xóa
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Thanh phân trang & đếm bản ghi */}
                                <div className="pagination-bar">
                                    <div className="pagination-info">
                                        Hiển thị <strong>{Math.min(filteredTickets.length, (currentPage - 1) * pageSize + 1)}</strong> - <strong>{Math.min(filteredTickets.length, currentPage * pageSize)}</strong> trên tổng số <strong>{filteredTickets.length}</strong> phiếu
                                    </div>
                                    <div className="pagination-controls">
                                        <div className="page-size-selector">
                                            <span>Số dòng:</span>
                                            <select 
                                                value={pageSize} 
                                                onChange={e => {
                                                    setPageSize(Number(e.target.value));
                                                    setCurrentPage(1);
                                                }}
                                                className="page-size-select"
                                            >
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                            </select>
                                        </div>

                                        <button 
                                            className="pagination-btn"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        >
                                            ◀ Trước
                                        </button>
                                        <span className="pagination-current">
                                            Trang {currentPage} / {totalPages}
                                        </span>
                                        <button 
                                            className="pagination-btn"
                                            disabled={currentPage >= totalPages}
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        >
                                            Sau ▶
                                        </button>
                                    </div>
                                </div>
                            </>
                        );
                    }}
                </DataState>
            </div>

            {/* Modal R - Xem chi tiết */}
            {detailTicketId && (
                <TicketDetailModal 
                    ticketId={detailTicketId}
                    initialTicket={selectedTicket}
                    onClose={() => {
                        setDetailTicketId(null);
                        setSelectedTicket(null);
                    }}
                    onOpenEdit={(ticket) => setEditingTicket(ticket)}
                />
            )}

            {/* Modal U - Chỉnh sửa */}
            {editingTicket && (
                <TicketEditModal 
                    ticket={editingTicket}
                    onClose={() => setEditingTicket(null)}
                    onSuccess={(updated) => {
                        setToast({
                            type: 'success',
                            title: 'Cập nhật thành công',
                            message: `Đã cập nhật thông tin phiếu bảo hành ${updated.ticket_code || ''}.`
                        });
                        refetch();
                    }}
                />
            )}

            {/* Modal D - Xóa */}
            {deletingTicket && (
                <TicketDeleteModal 
                    ticket={deletingTicket}
                    onClose={() => setDeletingTicket(null)}
                    onSuccess={(deleted) => {
                        setToast({
                            type: 'success',
                            title: 'Xóa thành công',
                            message: `Đã xóa phiếu bảo hành ${deleted.ticket_code || ''} khỏi hệ thống.`
                        });
                        refetch();
                    }}
                />
            )}
        </div>
    );
}
