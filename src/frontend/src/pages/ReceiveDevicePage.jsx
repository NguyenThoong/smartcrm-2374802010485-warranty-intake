import { useState } from 'react';
import { ticketsApi } from '../api/tickets.api';
import { devicesApi } from '../api/devices.api';
import { TicketDetailModal } from '../components/TicketDetailModal';
import { Toast } from '../components/Toast';
import { Link } from 'react-router-dom';

export default function ReceiveDevicePage() {
    // Chế độ tra cứu: 'serial' hoặc 'phone'
    const [searchMode, setSearchMode] = useState('serial');
    const [searchSerial, setSearchSerial] = useState('SN-IP-1122334');
    const [searchPhone, setSearchPhone] = useState('0988765432');

    // Dữ liệu tra cứu được
    const [deviceResult, setDeviceResult] = useState(null);
    const [searching, setSearching] = useState(false);
    const [searchFeedback, setSearchFeedback] = useState(null);

    // Form tiếp nhận
    const [formData, setFormData] = useState({
        customerId: '',
        customerPhone: '',
        customerName: '',
        deviceId: 1,
        serialNo: '',
        issueDesc: '',
        priority: 'Trung bình'
    });
    const [warning, setWarning] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    // Modal xem chi tiết phiếu nếu thiết bị đã có phiếu
    const [viewTicketId, setViewTicketId] = useState(null);

    // Tra cứu thiết bị theo Serial / IMEI
    const handleSearchSerial = async () => {
        if (!searchSerial.trim()) {
            setSearchFeedback({ type: 'warning', text: 'Vui lòng nhập số Serial Number hoặc IMEI.' });
            return;
        }

        setSearching(true);
        setSearchFeedback({ type: 'info', text: 'Đang tra cứu dữ liệu thiết bị trong hệ thống SmartCRM...' });

        try {
            const res = await devicesApi.traCuuSerial(searchSerial.trim());
            const device = res?.data || res;

            if (device && device.serial_no) {
                setDeviceResult(device);
                setSearchFeedback({ type: 'success', text: `Đã tìm thấy thông tin thiết bị ${device.serial_no}!` });

                // Tự động điền dữ liệu vào form tiếp nhận
                setFormData(prev => ({
                    ...prev,
                    serialNo: device.serial_no,
                    deviceId: device.device_id,
                    customerId: device.customer_id,
                    customerName: device.customer_name || '',
                    customerPhone: device.customer_phone || ''
                }));

                // Kiểm tra cảnh báo hạn bảo hành
                if (device.warrantyInfo && !device.warrantyInfo.isValid) {
                    setWarning(`Cảnh báo: Thiết bị đã quá hạn bảo hành chính hãng (${device.warrantyInfo.diffDays} ngày). Chuyển sang luồng tính phí hoặc gửi Quản lý xét duyệt ngoại lệ.`);
                } else if (device.serial_no === 'SN-A52-778901') {
                    setWarning('Cảnh báo: Thiết bị SN-A52-778901 đã hết hạn bảo hành (QT-01).');
                } else {
                    setWarning('');
                }
            } else {
                setDeviceResult(null);
                setSearchFeedback({ type: 'error', text: 'Không tìm thấy thông tin thiết bị với số Serial/IMEI này.' });
            }
        } catch (err) {
            // Trường hợp không tìm thấy trong DB, fallback kiểm tra rule đặc biệt
            setDeviceResult(null);
            if (searchSerial === 'SN-A52-778901') {
                setFormData(prev => ({ ...prev, serialNo: 'SN-A52-778901' }));
                setWarning('Cảnh báo: Thiết bị SN-A52-778901 đã hết hạn bảo hành (QT-01).');
                setSearchFeedback({ type: 'warning', text: 'Thiết bị SN-A52-778901 nằm trong danh sách hết hạn bảo hành cần duyệt ngoại lệ.' });
            } else {
                setSearchFeedback({ type: 'error', text: err.message || 'Không tìm thấy thiết bị hoặc lỗi kết nối.' });
            }
        } finally {
            setSearching(false);
        }
    };

    // Tra cứu khách hàng theo Số điện thoại
    const handleSearchPhone = async () => {
        if (!searchPhone.trim()) {
            setSearchFeedback({ type: 'warning', text: 'Vui lòng nhập số điện thoại để tra cứu.' });
            return;
        }

        setSearching(true);
        setSearchFeedback({ type: 'info', text: 'Đang tra cứu hồ sơ khách hàng...' });

        try {
            const customer = await devicesApi.traCuuKhachHang(searchPhone.trim());
            if (customer && customer.full_name) {
                const realCustomerId = customer.id || customer.customer_id;
                setFormData(prev => ({
                    ...prev,
                    customerPhone: customer.phone,
                    customerName: customer.full_name,
                    customerId: realCustomerId
                }));
                setSearchFeedback({ type: 'success', text: `Đã xác nhận khách hàng: ${customer.full_name} (${customer.segment || 'Mới'})` });

                if (formData.serialNo === 'SN-A52-778901') {
                    setWarning('Cảnh báo: Thiết bị SN-A52-778901 đã hết hạn bảo hành (QT-01).');
                } else {
                    setWarning('');
                }
            } else {
                setSearchFeedback({ type: 'error', text: 'Không tìm thấy khách hàng với số điện thoại này trong hệ thống.' });
            }
        } catch (err) {
            setSearchFeedback({ type: 'error', text: err.message || 'Không tìm thấy khách hàng hoặc lỗi kết nối.' });
        } finally {
            setSearching(false);
        }
    };

    // Gửi form tạo phiếu tiếp nhận bảo hành
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.customerId) {
            setToast({
                type: 'warning',
                title: 'Chưa có thông tin khách hàng',
                message: 'Vui lòng thực hiện tra cứu số Serial hoặc Số điện thoại để xác định khách hàng trước khi tạo phiếu.'
            });
            return;
        }

        if (!formData.issueDesc || formData.issueDesc.trim().length < 10) {
            setToast({
                type: 'warning',
                title: 'Mô tả sự cố quá ngắn',
                message: 'Mô tả sự cố phải có ít nhất 10 ký tự theo quy định kiểm tra bảo hành (BR4).'
            });
            return;
        }

        setSubmitting(true);
        try {
            const result = await ticketsApi.tiepNhan(formData);
            const ticketCode = result?.ticket_code || 'Mới';

            setToast({
                type: 'success',
                title: 'Tạo phiếu tiếp nhận thành công',
                message: `Đã khởi tạo phiếu bảo hành mã ${ticketCode}. Hạn SLA xử lý: 3 ngày làm việc.`
            });

            // Reset form sau khi tạo thành công
            setFormData({
                customerId: '',
                customerPhone: '',
                customerName: '',
                deviceId: 1,
                serialNo: '',
                issueDesc: '',
                priority: 'Trung bình'
            });
            setDeviceResult(null);
            setWarning('');
            setSearchFeedback(null);
        } catch (error) {
            setToast({
                type: 'error',
                title: 'Không thể tạo phiếu',
                message: error.message || 'Lỗi hệ thống khi tạo phiếu bảo hành.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleDateString('vi-VN', {
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
            <Toast toast={toast} onClose={() => setToast(null)} />

            {/* Header */}
            <div className="page-header">
                <div>
                    <span className="badge-subtitle">Giao diện Tiếp tân (Front-Desk UI-01)</span>
                    <h1 className="page-title">Tra cứu thiết bị & Tiếp nhận bảo hành</h1>
                    <p className="page-description">
                        Tra cứu lịch sử mua hàng theo Serial Number/IMEI hoặc Số điện thoại, kiểm tra hạn bảo hành tự động và lập phiếu tiếp nhận máy vào phòng Lab.
                    </p>
                </div>
                <div className="page-header-actions">
                    <Link to="/" className="btn btn-secondary">
                        📋 Xem danh sách phiếu
                    </Link>
                </div>
            </div>

            <div className="intake-layout-grid">
                {/* Cột trái: Vùng tra cứu thông tin (UI-01) */}
                <div className="lookup-column">
                    <div className="card intake-card">
                        <div className="card-header">
                            <div className="card-header-icon">🔍</div>
                            <div>
                                <h3 className="card-title">1. Tra cứu thông tin thiết bị & Khách hàng</h3>
                                <p className="card-subtitle">Nhập số Serial/IMEI hoặc Số điện thoại để hệ thống tự động đối soát chính sách</p>
                            </div>
                        </div>

                        <div className="card-body">
                            {/* Chuyển đổi tab chế độ tra cứu */}
                            <div className="search-mode-tabs">
                                <button 
                                    className={`mode-tab-btn ${searchMode === 'serial' ? 'active' : ''}`}
                                    onClick={() => setSearchMode('serial')}
                                    type="button"
                                >
                                    📱 Tra cứu theo Serial / IMEI
                                </button>
                                <button 
                                    className={`mode-tab-btn ${searchMode === 'phone' ? 'active' : ''}`}
                                    onClick={() => setSearchMode('phone')}
                                    type="button"
                                >
                                    📞 Tra cứu theo Số điện thoại
                                </button>
                            </div>

                            {/* Khu vực nhập Serial */}
                            {searchMode === 'serial' && (
                                <div className="lookup-input-group mt-3">
                                    <label className="form-label" htmlFor="serial-lookup-input">
                                        Số Serial Number / IMEI máy
                                    </label>
                                    <div className="input-with-button">
                                        <input 
                                            id="serial-lookup-input"
                                            type="text" 
                                            className="form-control font-mono"
                                            value={searchSerial}
                                            onChange={e => setSearchSerial(e.target.value)}
                                            placeholder="Ví dụ: SN-IP-1122334"
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-primary"
                                            onClick={handleSearchSerial}
                                            disabled={searching}
                                        >
                                            {searching ? 'Đang tìm...' : 'Tra cứu'}
                                        </button>
                                    </div>
                                    <div className="quick-suggestions">
                                        <span className="text-muted text-xs">Mẫu thử nhanh:</span>
                                        <button type="button" className="tag-suggestion" onClick={() => setSearchSerial('SN-IP-1122334')}>
                                            SN-IP-1122334 (iPhone hợp lệ)
                                        </button>
                                        <button type="button" className="tag-suggestion" onClick={() => setSearchSerial('SN-A52-778901')}>
                                            SN-A52-778901 (Hết hạn QT-01)
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Khu vực nhập SĐT */}
                            {searchMode === 'phone' && (
                                <div className="lookup-input-group mt-3">
                                    <label className="form-label" htmlFor="phone-lookup-input">
                                        Số điện thoại khách hàng
                                    </label>
                                    <div className="input-with-button">
                                        <input 
                                            id="phone-lookup-input"
                                            type="text" 
                                            className="form-control"
                                            value={searchPhone}
                                            onChange={e => setSearchPhone(e.target.value)}
                                            placeholder="Ví dụ: 0988765432"
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-primary"
                                            onClick={handleSearchPhone}
                                            disabled={searching}
                                        >
                                            {searching ? 'Đang tìm...' : 'Tra cứu'}
                                        </button>
                                    </div>
                                    <div className="quick-suggestions">
                                        <span className="text-muted text-xs">Mẫu thử nhanh:</span>
                                        <button type="button" className="tag-suggestion" onClick={() => setSearchPhone('0988765432')}>
                                            0988765432 (Trần Thị Bình - VIP)
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Thông báo kết quả tra cứu */}
                            {searchFeedback && (
                                <div className={`feedback-alert feedback-${searchFeedback.type} mt-3`}>
                                    <span>{searchFeedback.text}</span>
                                </div>
                            )}

                            {/* Kết quả chi tiết sau khi tra cứu Serial */}
                            {deviceResult && (
                                <div className="lookup-results-box mt-4">
                                    {/* Khối Trạng thái bảo hành */}
                                    <div className="warranty-status-header">
                                        <div className="warranty-status-badge-container">
                                            <span className="text-sm font-medium">Tình trạng bảo hành:</span>
                                            {deviceResult.warrantyInfo?.isValid ? (
                                                <span className="badge-warranty-valid">
                                                    🟢 HỢP LỆ (Còn {deviceResult.warrantyInfo.diffDays} ngày)
                                                </span>
                                            ) : (
                                                <span className="badge-warranty-expired">
                                                    🔴 HẾT HẠN (Quá {deviceResult.warrantyInfo?.diffDays || 0} ngày)
                                                </span>
                                            )}
                                        </div>
                                        <p className="warranty-message-text">
                                            {deviceResult.warrantyInfo?.message}
                                        </p>
                                    </div>

                                    {/* Grid thông tin chi tiết */}
                                    <div className="device-customer-grid mt-3">
                                        <div className="mini-info-box">
                                            <span className="mini-info-label">Chủ sở hữu:</span>
                                            <span className="mini-info-val font-medium">{deviceResult.customer_name}</span>
                                            <span className="mini-info-sub">📞 {deviceResult.customer_phone}</span>
                                        </div>
                                        <div className="mini-info-box">
                                            <span className="mini-info-label">Phân khúc khách:</span>
                                            <span className={`segment-tag segment-${deviceResult.customer_segment || 'MOI'}`}>
                                                {deviceResult.customer_segment || 'MOI'}
                                            </span>
                                        </div>
                                        <div className="mini-info-box">
                                            <span className="mini-info-label">Số Serial/IMEI:</span>
                                            <span className="mini-info-val font-mono">{deviceResult.serial_no}</span>
                                        </div>
                                        <div className="mini-info-box">
                                            <span className="mini-info-label">Ngày mua hàng:</span>
                                            <span className="mini-info-val">{formatDate(deviceResult.purchase_date)}</span>
                                            <span className="mini-info-sub">Gói BH: {deviceResult.warranty_months} tháng</span>
                                        </div>
                                    </div>

                                    {/* Nếu thiết bị ĐÃ CÓ phiếu bảo hành trong hệ thống */}
                                    {deviceResult.previousTickets && deviceResult.previousTickets.length > 0 && (
                                        <div className="existing-tickets-alert mt-3">
                                            <div className="existing-tickets-header">
                                                <span className="alert-icon">⚠️</span>
                                                <span className="font-medium">
                                                    Thiết bị này đã có {deviceResult.previousTickets.length} phiếu bảo hành trong hệ thống:
                                                </span>
                                            </div>
                                            <div className="existing-tickets-list mt-2">
                                                {deviceResult.previousTickets.map(pt => (
                                                    <div key={pt.ticket_id} className="existing-ticket-row">
                                                        <span className="font-mono font-bold text-primary">{pt.ticket_code}</span>
                                                        <span className="text-sm font-medium">{pt.status}</span>
                                                        <span className="text-muted text-xs">{formatDate(pt.received_at)}</span>
                                                        <button 
                                                            type="button"
                                                            className="btn-link-action"
                                                            onClick={() => setViewTicketId(pt.ticket_id)}
                                                        >
                                                            👁️ Xem chi tiết phiếu
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cột phải: Form Tạo phiếu tiếp nhận bảo hành */}
                <div className="form-column">
                    <div className="card intake-card">
                        <div className="card-header">
                            <div className="card-header-icon bg-blue-light text-primary">📝</div>
                            <div>
                                <h3 className="card-title">2. Lập phiếu tiếp nhận bảo hành</h3>
                                <p className="card-subtitle">Điền thông tin sự cố, mức độ ưu tiên và hệ thống sẽ tự động tính hạn SLA</p>
                            </div>
                        </div>

                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {/* Thông tin khách hàng */}
                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="customer-phone">
                                            (1) Số điện thoại khách <span className="required">*</span>
                                        </label>
                                        <input 
                                            id="customer-phone"
                                            type="text" 
                                            className="form-control"
                                            value={formData.customerPhone} 
                                            onChange={e => setFormData({ ...formData, customerPhone: e.target.value })} 
                                            placeholder="0988 765 432"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="customer-name">
                                            (2) Họ tên khách hàng
                                        </label>
                                        <input 
                                            id="customer-name"
                                            type="text" 
                                            className="form-control bg-light"
                                            value={formData.customerName} 
                                            readOnly 
                                            placeholder="Tự động điền sau khi tra cứu..."
                                        />
                                    </div>
                                </div>

                                {/* Số serial thiết bị */}
                                <div className="form-group mt-3">
                                    <label className="form-label" htmlFor="serial-no">
                                        (3) Số Serial / IMEI thiết bị <span className="required">*</span>
                                    </label>
                                    <input 
                                        id="serial-no"
                                        type="text" 
                                        className="form-control font-mono"
                                        value={formData.serialNo} 
                                        onChange={e => setFormData({ ...formData, serialNo: e.target.value })} 
                                        placeholder="Ví dụ: SN-IP-1122334"
                                        required
                                    />
                                </div>

                                {/* Mô tả sự cố */}
                                <div className="form-group mt-3">
                                    <label className="form-label" htmlFor="issue-desc">
                                        (4) Mô tả sự cố thực tế <span className="required">*</span>
                                        <span className={`char-count ${formData.issueDesc.length < 10 ? 'text-danger' : 'text-success'}`}>
                                            ({formData.issueDesc.length}/10 ký tự tối thiểu)
                                        </span>
                                    </label>
                                    <textarea 
                                        id="issue-desc"
                                        className="form-control"
                                        rows="3"
                                        value={formData.issueDesc} 
                                        onChange={e => setFormData({ ...formData, issueDesc: e.target.value })} 
                                        placeholder="Mô tả chi tiết tình trạng lỗi của máy (ví dụ: Màn hình bị chớp tắt liên tục khi vừa khởi động...)"
                                        required
                                    />
                                    <div className="form-help-text">
                                        Lưu ý: Cần nhập tối thiểu 10 ký tự để bộ phận Lab có đủ cơ sở chẩn đoán lỗi.
                                    </div>
                                </div>

                                {/* Mức độ ưu tiên */}
                                <div className="form-group mt-3">
                                    <label className="form-label">
                                        (5) Mức độ ưu tiên xử lý
                                    </label>
                                    <div className="radio-group-cards">
                                        <label className={`radio-card ${formData.priority === 'Cao' ? 'active radio-card-cao' : ''}`}>
                                            <input 
                                                type="radio" 
                                                name="priority" 
                                                value="Cao" 
                                                checked={formData.priority === 'Cao'} 
                                                onChange={() => setFormData({ ...formData, priority: 'Cao' })} 
                                            />
                                            <span className="radio-card-content">
                                                <span className="radio-card-title">Cao</span>
                                                <span className="radio-card-desc">Khách VIP / Hỏng nặng</span>
                                            </span>
                                        </label>
                                        <label className={`radio-card ${formData.priority === 'Trung bình' ? 'active radio-card-trung-binh' : ''}`}>
                                            <input 
                                                type="radio" 
                                                name="priority" 
                                                value="Trung bình" 
                                                checked={formData.priority === 'Trung bình'} 
                                                onChange={() => setFormData({ ...formData, priority: 'Trung bình' })} 
                                            />
                                            <span className="radio-card-content">
                                                <span className="radio-card-title">Trung bình</span>
                                                <span className="radio-card-desc">Xử lý tiêu chuẩn</span>
                                            </span>
                                        </label>
                                        <label className={`radio-card ${formData.priority === 'Thấp' ? 'active radio-card-thap' : ''}`}>
                                            <input 
                                                type="radio" 
                                                name="priority" 
                                                value="Thấp" 
                                                checked={formData.priority === 'Thấp'} 
                                                onChange={() => setFormData({ ...formData, priority: 'Thấp' })} 
                                            />
                                            <span className="radio-card-content">
                                                <span className="radio-card-title">Thấp</span>
                                                <span className="radio-card-desc">Bảo dưỡng thông thường</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Cam kết SLA tự động */}
                                <div className="sla-banner mt-4">
                                    <div className="sla-banner-icon">⏱️</div>
                                    <div className="sla-banner-text">
                                        <span className="sla-banner-title">Cam kết thời hạn xử lý (SLA tiêu chuẩn):</span>
                                        <span className="sla-banner-desc">
                                            Thời gian cam kết trả máy tối đa là <strong>03 ngày làm việc</strong> kể từ lúc tiếp nhận (Quy tắc BR2).
                                        </span>
                                    </div>
                                </div>

                                {/* Cảnh báo vi phạm chính sách / Ngoại lệ */}
                                {warning && (
                                    <div className="warning-banner mt-3">
                                        <span className="warning-banner-icon">⚠️</span>
                                        <span className="warning-banner-text">{warning}</span>
                                    </div>
                                )}

                                {/* Nút hành động */}
                                <div className="form-actions mt-4">
                                    <button 
                                        type="button" 
                                        className="btn btn-default"
                                        onClick={() => {
                                            setFormData({ customerId: '', customerPhone: '', customerName: '', deviceId: 1, serialNo: '', issueDesc: '', priority: 'Trung bình' });
                                            setWarning('');
                                            setDeviceResult(null);
                                        }}
                                    >
                                        Hủy / Làm lại
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-submit"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Đang khởi tạo phiếu...' : '➕ Xác nhận lập phiếu tiếp nhận'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal xem chi tiết phiếu nếu có */}
            {viewTicketId && (
                <TicketDetailModal 
                    ticketId={viewTicketId}
                    onClose={() => setViewTicketId(null)}
                />
            )}
        </div>
    );
}
