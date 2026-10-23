import { useState } from 'react';
import { useTickets } from '../hooks/useTickets';
import { DataState } from '../components/DataState';

export default function TicketListPage() {
    const [filters, setFilters] = useState({});
    const { data, loading, error } = useTickets(filters);

    return (
        <section style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Danh sách phiếu bảo hành</h2>
            
            <DataState 
                loading={loading} 
                error={error} 
                data={data}
                empty={{ 
                    message: 'Không có phiếu nào khớp bộ lọc hiện tại.',
                    action: <button onClick={() => setFilters({})}>Xoá bộ lọc</button> 
                }}
            >
                {(rows) => (
                    <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f4f4f4' }}>
                                <th>Mã phiếu</th>
                                <th>Khách hàng ID</th>
                                <th>Mô tả lỗi</th>
                                <th>Mức độ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(ticket => (
                                <tr key={ticket.ticket_id}>
                                    <td>{ticket.ticket_code}</td>
                                    <td>{ticket.customer_id}</td>
                                    <td>{ticket.issue_desc}</td>
                                    <td>{ticket.priority}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </DataState>
        </section>
    );
}