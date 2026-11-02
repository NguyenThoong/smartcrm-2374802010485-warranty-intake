import { useEffect, useState } from 'react';
import { ticketsApi } from '../api/tickets.api';
import { StatusBadge, PriorityBadge } from './StatusBadge';

export function TicketDetailModal({ ticketId, initialTicket, onClose, onOpenEdit }) {
    const [ticket, setTicket] = useState(initialTicket || null);
    const [loading, setLoading] = useState(Boolean(!initialTicket?.logs));
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!ticketId) return;
        let active = true;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);

        ticketsApi.chiTiet(ticketId)
            .then(data => {
                if (active) {
                    setTicket(data);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (active) {
                    setError(err.message || 'Không thể tải chi tiết phiếu');
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [ticketId]);

    if (!ticketId) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            const d = new Date(dateStr);
            return d.toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-container modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-group">
                        <span className="modal-tag">Chi tiết phiếu bảo hành</span>
                        <h3 className="modal-title">{ticket?.ticket_code || `Phiếu #${ticketId}`}</h3>
                        {ticket && (
                            <div className="modal-badges">
                                <StatusBadge status={ticket.status} />
                                <PriorityBadge priority={ticket.priority} />
                            </div>
                        )}
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    {loading && (
                        <div className="modal-loading">
                            <div className="spinner"></div>
                            <p>Đang tải chi tiết phiếu bảo hành và lịch sử...</p>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error">
                            <p>⚠️ {error}</p>
                        </div>
                    )}

                    {!loading && ticket && (
                        <div className="detail-content">
                            {/* Grid 2 cột thông tin */}
                            <div className="detail-grid">
                                {/* Card Khách hàng */}
                                <div className="info-card">
                                    <div className="info-card-header">
                                        <span className="info-icon">👤</span>
                                        <h4>Thông tin khách hàng</h4>
                                    </div>
                                    <div className="info-card-body">
                                        <div className="info-row">
                                            <span className="info-label">Họ và tên:</span>
                                            <span className="info-value font-medium">{ticket.customer_name || 'Khách hàng #' + ticket.customer_id}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Số điện thoại:</span>
                                            <span className="info-value">{ticket.customer_phone || 'Chưa cập nhật'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Email:</span>
                                            <span className="info-value">{ticket.customer_email || 'Chưa cập nhật'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Phân khúc:</span>
                                            <span className="info-value">
                                                <span className={`segment-tag segment-${ticket.customer_segment || 'MOI'}`}>
                                                    {ticket.customer_segment || 'MOI'}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Thiết bị */}
                                <div className="info-card">
                                    <div className="info-card-header">
                                        <span className="info-icon">📱</span>
                                        <h4>Thông tin thiết bị</h4>
                                    </div>
                                    <div className="info-card-body">
                                        <div className="info-row">
                                            <span className="info-label">Số Serial / IMEI:</span>
                                            <span className="info-value font-mono font-medium">{ticket.serial_no || 'Thiết bị #' + ticket.device_id}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Ngày mua hàng:</span>
                                            <span className="info-value">{formatDate(ticket.purchase_date)}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Thời hạn BH gốc:</span>
                                            <span className="info-value">{ticket.warranty_months ? `${ticket.warranty_months} tháng` : 'N/A'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Kỹ thuật viên:</span>
                                            <span className="info-value">{ticket.technician_code || 'Chưa phân bổ Lab'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Khối Sự cố & SLA */}
                            <div className="info-card mt-4">
                                <div className="info-card-header">
                                    <span className="info-icon">🔧</span>
                                    <h4>Nội dung tiếp nhận & Cam kết dịch vụ (SLA)</h4>
                                </div>
                                <div className="info-card-body">
                                    <div className="issue-desc-box">
                                        <span className="issue-desc-label">Mô tả sự cố thực tế:</span>
                                        <p className="issue-desc-text">{ticket.issue_desc}</p>
                                    </div>
                                    <div className="sla-timeline-grid">
                                        <div className="sla-item">
                                            <span className="sla-item-label">Thời điểm tiếp nhận</span>
                                            <span className="sla-item-value">{formatDate(ticket.received_at)}</span>
                                        </div>
                                        <div className="sla-item sla-item-due">
                                            <span className="sla-item-label">Hạn cam kết trả máy (SLA)</span>
                                            <span className="sla-item-value font-medium text-primary">{formatDate(ticket.due_date)}</span>
                                        </div>
                                        <div className="sla-item">
                                            <span className="sla-item-label">Thời điểm đóng phiếu</span>
                                            <span className="sla-item-value">{ticket.closed_at ? formatDate(ticket.closed_at) : 'Đang xử lý (Chưa đóng)'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Khối Lịch sử chuyển trạng thái (Audit Log) */}
                            <div className="info-card mt-4">
                                <div className="info-card-header">
                                    <span className="info-icon">📜</span>
                                    <h4>Lịch sử chuyển trạng thái (Audit Log)</h4>
                                </div>
                                <div className="info-card-body">
                                    {(!ticket.logs || ticket.logs.length === 0) ? (
                                        <p className="text-muted text-sm italic">Chưa ghi nhận bước chuyển trạng thái phụ nào.</p>
                                    ) : (
                                        <div className="timeline-container">
                                            {ticket.logs.map((log, index) => (
                                                <div key={log.log_id || index} className="timeline-item">
                                                    <div className="timeline-marker"></div>
                                                    <div className="timeline-content">
                                                        <div className="timeline-header">
                                                            <span className="timeline-action">
                                                                {log.from_status ? (
                                                                    <>
                                                                        <span className="font-mono">{log.from_status}</span>
                                                                        {' ➔ '}
                                                                        <span className="font-mono text-primary font-bold">{log.to_status}</span>
                                                                    </>
                                                                ) : (
                                                                    <>Khởi tạo phiếu: <span className="font-mono text-primary font-bold">{log.to_status}</span></>
                                                                )}
                                                            </span>
                                                            <span className="timeline-time">{formatDate(log.changed_at)}</span>
                                                        </div>
                                                        <div className="timeline-author">
                                                            Người thực hiện: <span className="font-medium">{log.changed_by || 'Nhân viên hệ thống'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => window.print()}
                    >
                        🖨️ In phiếu hẹn
                    </button>
                    {onOpenEdit && ticket && (
                        <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={() => {
                                onClose();
                                onOpenEdit(ticket);
                            }}
                        >
                            ✏️ Chỉnh sửa phiếu này
                        </button>
                    )}
                    <button type="button" className="btn btn-default" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
