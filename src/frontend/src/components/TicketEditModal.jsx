import { useState } from 'react';
import { ticketsApi } from '../api/tickets.api';

export function TicketEditModal({ ticket, onClose, onSuccess }) {
    const [issueDesc, setIssueDesc] = useState(ticket?.issue_desc || '');
    const [priority, setPriority] = useState(ticket?.priority || 'TRUNG_BINH');
    const [status, setStatus] = useState(ticket?.status || 'TIEP_NHAN');
    const [changedBy, setChangedBy] = useState('Nhân viên Tiếp tân');
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    if (!ticket) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        // Kiểm tra ràng buộc BR4: mô tả lỗi tối thiểu 10 ký tự
        if (!issueDesc || issueDesc.trim().length < 10) {
            setErrorMsg('Mô tả sự cố bắt buộc phải có độ dài từ 10 ký tự trở lên (Quy tắc BR4).');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                issue_desc: issueDesc.trim(),
                priority,
                status,
                changed_by: changedBy.trim() || 'Nhân viên hệ thống'
            };

            const result = await ticketsApi.capNhat(ticket.ticket_id, payload);
            onSuccess(result || { ...ticket, ...payload });
            onClose();
        } catch (err) {
            setErrorMsg(err.message || 'Lỗi khi cập nhật phiếu bảo hành. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-container modal-md" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-group">
                        <span className="modal-tag">Chỉnh sửa thông tin</span>
                        <h3 className="modal-title">Cập nhật phiếu {ticket.ticket_code}</h3>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {errorMsg && (
                            <div className="alert alert-error mb-4">
                                <span>⚠️ {errorMsg}</span>
                            </div>
                        )}

                        {/* Thông tin hệ thống chỉ xem (Read-only) */}
                        <div className="readonly-box mb-4">
                            <div className="readonly-row">
                                <span className="readonly-label">Mã phiếu:</span>
                                <span className="readonly-val font-mono font-bold">{ticket.ticket_code}</span>
                            </div>
                            <div className="readonly-row">
                                <span className="readonly-label">Khách hàng:</span>
                                <span className="readonly-val">{ticket.customer_name || `ID #${ticket.customer_id}`}</span>
                            </div>
                            <div className="readonly-row">
                                <span className="readonly-label">Số Serial/IMEI:</span>
                                <span className="readonly-val font-mono">{ticket.serial_no || `Thiết bị #${ticket.device_id}`}</span>
                            </div>
                        </div>

                        {/* Trường Mô tả sự cố */}
                        <div className="form-group mb-4">
                            <label className="form-label" htmlFor="edit-issue-desc">
                                Mô tả sự cố hư hỏng <span className="required">*</span>
                                <span className={`char-count ${issueDesc.length < 10 ? 'text-danger' : 'text-success'}`}>
                                    ({issueDesc.length}/10 ký tự tối thiểu)
                                </span>
                            </label>
                            <textarea
                                id="edit-issue-desc"
                                className="form-control"
                                rows="3"
                                value={issueDesc}
                                onChange={e => setIssueDesc(e.target.value)}
                                placeholder="Nhập chi tiết mô tả sự cố hư hỏng của máy..."
                                required
                            />
                            {issueDesc.length < 10 && (
                                <p className="form-help-text text-danger">Mô tả cần ít nhất 10 ký tự theo quy định kiểm tra tiếp nhận.</p>
                            )}
                        </div>

                        {/* Mức độ ưu tiên */}
                        <div className="form-group mb-4">
                            <label className="form-label">Mức độ ưu tiên xử lý <span className="required">*</span></label>
                            <div className="radio-group-cards">
                                <label className={`radio-card ${priority === 'CAO' ? 'active radio-card-cao' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name="priority" 
                                        value="CAO" 
                                        checked={priority === 'CAO'} 
                                        onChange={() => setPriority('CAO')} 
                                    />
                                    <span className="radio-card-content">
                                        <span className="radio-card-title">Cao</span>
                                        <span className="radio-card-desc">Khách VIP / Máy sự cố nặng</span>
                                    </span>
                                </label>
                                <label className={`radio-card ${priority === 'TRUNG_BINH' ? 'active radio-card-trung-binh' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name="priority" 
                                        value="TRUNG_BINH" 
                                        checked={priority === 'TRUNG_BINH'} 
                                        onChange={() => setPriority('TRUNG_BINH')} 
                                    />
                                    <span className="radio-card-content">
                                        <span className="radio-card-title">Trung bình</span>
                                        <span className="radio-card-desc">Quy trình xử lý tiêu chuẩn</span>
                                    </span>
                                </label>
                                <label className={`radio-card ${priority === 'THAP' ? 'active radio-card-thap' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name="priority" 
                                        value="THAP" 
                                        checked={priority === 'THAP'} 
                                        onChange={() => setPriority('THAP')} 
                                    />
                                    <span className="radio-card-content">
                                        <span className="radio-card-title">Thấp</span>
                                        <span className="radio-card-desc">Lỗi phần mềm / Vệ sinh máy</span>
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Trạng thái phiếu */}
                        <div className="form-group mb-4">
                            <label className="form-label" htmlFor="edit-status">
                                Trạng thái phiếu bảo hành <span className="required">*</span>
                            </label>
                            <select
                                id="edit-status"
                                className="form-select"
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                            >
                                <option value="TIEP_NHAN">TIEP_NHAN - Tiếp nhận ban đầu</option>
                                <option value="CHO_DUYET">CHO_DUYET - Chờ duyệt ngoại lệ</option>
                                <option value="DA_BAN_GIAO">DA_BAN_GIAO - Đã bàn giao sang Kỹ thuật (Lab)</option>
                                <option value="DANG_SUA">DANG_SUA - Đang sửa chữa tại Lab</option>
                                <option value="HOAN_TAT">HOAN_TAT - Đã hoàn tất sửa chữa / Đóng phiếu</option>
                                <option value="TU_CHOI">TU_CHOI - Từ chối bảo hành</option>
                            </select>
                        </div>

                        {/* Ghi chú người sửa (để lưu vào ticket_status_log) */}
                        <div className="form-group mb-2">
                            <label className="form-label" htmlFor="edit-changed-by">
                                Nhân viên thực hiện cập nhật
                            </label>
                            <input
                                id="edit-changed-by"
                                type="text"
                                className="form-control"
                                value={changedBy}
                                onChange={e => setChangedBy(e.target.value)}
                                placeholder="Tên nhân viên tiếp tân hoặc quản lý..."
                            />
                            <p className="form-help-text">Thông tin này sẽ được lưu vết vào nhật ký kiểm soát (Audit Log).</p>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" onClick={onClose} disabled={submitting}>
                            Hủy bỏ
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Đang lưu cập nhật...' : '💾 Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

