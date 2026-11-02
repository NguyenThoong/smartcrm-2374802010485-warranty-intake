import { useState } from 'react';
import { ticketsApi } from '../api/tickets.api';

export function TicketDeleteModal({ ticket, onClose, onSuccess }) {
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    if (!ticket) return null;

    const handleDelete = async () => {
        setErrorMsg('');
        setSubmitting(true);
        try {
            await ticketsApi.xoa(ticket.ticket_id);
            onSuccess(ticket);
            onClose();
        } catch (err) {
            setErrorMsg(err.message || 'Lỗi khi xóa phiếu bảo hành. Vui lòng thử lại.');
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-container modal-sm" onClick={e => e.stopPropagation()}>
                <div className="modal-header modal-header-danger">
                    <div className="modal-title-group">
                        <span className="modal-icon-danger">⚠️</span>
                        <h3 className="modal-title text-danger">Xác nhận xóa phiếu bảo hành</h3>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    {errorMsg && (
                        <div className="alert alert-error mb-4">
                            <span>❌ {errorMsg}</span>
                        </div>
                    )}

                    <p className="delete-confirm-text">
                        Bạn có chắc chắn muốn xóa phiếu bảo hành{' '}
                        <strong className="font-mono text-danger font-bold">
                            {ticket.ticket_code || `#${ticket.ticket_id}`}
                        </strong>{' '}
                        khỏi hệ thống SmartCRM?
                    </p>

                    <div className="delete-info-summary">
                        <div className="summary-item">
                            <span className="summary-label">Khách hàng:</span>
                            <span className="summary-val">{ticket.customer_name || `ID #${ticket.customer_id}`}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Số Serial/IMEI:</span>
                            <span className="summary-val font-mono">{ticket.serial_no || `Thiết bị #${ticket.device_id}`}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Trạng thái hiện tại:</span>
                            <span className="summary-val font-medium">{ticket.status}</span>
                        </div>
                    </div>

                    <div className="delete-warning-box">
                        <span className="warning-icon">❗</span>
                        <span>
                            Hành động này sẽ xóa vĩnh viễn phiếu bảo hành và toàn bộ lịch sử trạng thái liên quan. Dữ liệu khách hàng và thiết bị vẫn được bảo toàn nguyên vẹn.
                        </span>
                    </div>
                </div>

                <div className="modal-footer">
                    <button 
                        type="button" 
                        className="btn btn-default" 
                        onClick={onClose} 
                        disabled={submitting}
                    >
                        Hủy thao tác
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-danger" 
                        onClick={handleDelete} 
                        disabled={submitting}
                    >
                        {submitting ? 'Đang xóa...' : '🗑️ Xác nhận xóa'}
                    </button>
                </div>
            </div>
        </div>
    );
}

