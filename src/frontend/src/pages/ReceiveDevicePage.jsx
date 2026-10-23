import { useState } from 'react';
import { ticketsApi } from '../api/tickets.api';

export default function ReceiveDevicePage() {
    const [formData, setFormData] = useState({
        customerPhone: '',
        customerName: '',
        serialNo: '',
        issueDesc: '',
        priority: 'Trung bình'
    });
    const [warning, setWarning] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSearch = () => {
        // Giả lập tra cứu, thực tế gọi API tra cứu khách hàng
        setFormData(prev => ({ ...prev, customerName: 'Nguyễn Văn An (tự điền)' }));
        if (formData.serialNo === 'SN-A52-778901') {
            setWarning('Cảnh báo: Thiết bị SN-A52-778901 đã hết hạn bảo hành (QT-01).');
        } else {
            setWarning('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await ticketsApi.tiepNhan(formData);
            setMessage('Tạo phiếu thành công!');
            setFormData({ customerPhone: '', customerName: '', serialNo: '', issueDesc: '', priority: 'Trung bình' });
        } catch (error) {
            setMessage(`Lỗi: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', border: '1px solid #ccc' }}>
            <h2>[ o o o ] Tạo phiếu bảo hành</h2>
            <hr />
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <label style={{ width: '200px' }}>(1) Số điện thoại khách</label>
                    <input type="text" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} style={{ flex: 1 }} placeholder="0909 123 456" />
                    <button type="button" onClick={handleSearch}>Tra cứu</button>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <label style={{ width: '200px' }}>(2) Họ tên khách</label>
                    <input type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} style={{ flex: 1 }} readOnly />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <label style={{ width: '200px' }}>(3) Số serial thiết bị</label>
                    <input type="text" value={formData.serialNo} onChange={e => setFormData({...formData, serialNo: e.target.value})} style={{ flex: 1 }} placeholder="SN-A52-778901" />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <label style={{ width: '200px' }}>(4) Mô tả sự cố</label>
                    <input type="text" value={formData.issueDesc} onChange={e => setFormData({...formData, issueDesc: e.target.value})} style={{ flex: 1 }} placeholder="Máy không lên nguồn sau khi sạc..." />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <label style={{ width: '200px' }}>(5) Mức ưu tiên</label>
                    <div>
                        <label><input type="radio" name="priority" checked={formData.priority === 'Cao'} onChange={() => setFormData({...formData, priority: 'Cao'})} /> Cao</label>
                        <label style={{ margin: '0 10px' }}><input type="radio" name="priority" checked={formData.priority === 'Trung bình'} onChange={() => setFormData({...formData, priority: 'Trung bình'})} /> Trung bình</label>
                        <label><input type="radio" name="priority" checked={formData.priority === 'Thấp'} onChange={() => setFormData({...formData, priority: 'Thấp'})} /> Thấp</label>
                    </div>
                </div>
                {warning && <p style={{ color: 'red', fontWeight: 'bold' }}>(6) [!] {warning}</p>}
                <hr />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button">Hủy</button>
                    <button type="submit" disabled={submitting}>Tạo phiếu</button>
                </div>
                {message && <p>{message}</p>}
            </form>
        </section>
    );
}