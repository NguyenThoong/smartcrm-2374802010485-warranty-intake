import { useState } from 'react';

export default function TicketApprovalPage({ ticketId = 'TK-2026-002' }) {
    const [note, setNote] = useState('');

    return (
        <section style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', border: '1px solid #ccc' }}>
            <h2>[ o o o ] Xét duyệt ngoại lệ tiếp nhận: {ticketId}</h2>
            <hr />
            <div style={{ marginBottom: '15px' }}>
                <p>Mã Ticket: {ticketId} <span style={{ marginLeft: '20px' }}>Khách hàng: Trần Thị Bình (VIP)</span></p>
                <p>Thiết bị: iPhone 13 Pro Max <span style={{ marginLeft: '20px' }}>Số Serial: SN-IP-1122334</span></p>
            </div>
            <hr />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label style={{ width: '200px' }}>(1) Tình trạng vi phạm:</label>
                    <input type="text" value="Trễ hạn bảo hành 03 ngày (Hết hạn ngày 06/10/2026)" readOnly style={{ flex: 1 }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label style={{ width: '200px' }}>Đề xuất của tiếp tân:</label>
                    <input type="text" value="Khách hàng thân thiết VIP, đề xuất hỗ trợ duyệt đặc cách" readOnly style={{ flex: 1 }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label style={{ width: '200px' }}>(2) Ghi chú xét duyệt (*):</label>
                    <input type="text" value={note} onChange={e => setNote(e.target.value)} style={{ flex: 1 }} placeholder="Đồng ý hỗ trợ diện khách VIP, tính 50% phí linh kiện..." />
                </div>
            </div>
            <hr />
            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button">Đóng</button>
                <button type="button">(3) Từ chối ngoại lệ</button>
                <button type="button">(4) Phê duyệt tiếp nhận</button>
            </div>
        </section>
    );
}