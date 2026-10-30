import { useState } from 'react';
import { useTickets } from '../hooks/useTickets';
import { DataState } from '../components/DataState';

export default function TicketListPage() {
    const [filters, setFilters] = useState({});
    const { data, loading, error } = useTickets(filters);

    return (
        <section style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
            <h2>Danh sách phiếu bảo hành</h2>
            
            {/* Thanh tìm kiếm - Phục vụ việc ép trạng thái Rỗng */}
            <div style={{ marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Nhập mã phiếu để tìm... (VD: TK-9999)" 
                    value={filters.ticketCode || ''}
                    onChange={(e) => setFilters({ ...filters, ticketCode: e.target.value })}
                    style={{ padding: '8px', width: '300px', marginRight: '10px' }}
                />
            </div>

            <DataState 
                loading={loading} 
                error={error} 
                data={data}
                empty={{ 
                    message: 'Không có phiếu nào khớp bộ lọc hiện tại.',
                    action: <button onClick={() => setFilters({})}>Xoá bộ lọc</button> 
                }}
            >
                {(rows) => {
                    // Lọc dữ liệu trên Frontend nếu backend chưa hỗ trợ tìm kiếm theo ticketCode
                    const filteredRows = rows.filter(ticket => 
                        !filters.ticketCode || 
                        (ticket.ticket_code && ticket.ticket_code.toLowerCase().includes(filters.ticketCode.toLowerCase()))
                    );

                    if (filteredRows.length === 0) {
                        return (
                            <div style={{ textAlign: 'center', padding: '30px', border: '1px dashed #666', color: '#aaa', marginTop: '15px' }}>
                                Không có phiếu nào khớp bộ lọc hiện tại.
                                <br />
                                <button onClick={() => setFilters({})} style={{ marginTop: '10px', cursor: 'pointer' }}>Xoá bộ lọc</button>
                            </div>
                        );
                    }

                    return (
                        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f4f4f4' }}>
                                    <th>Mã phiếu</th>
                                    <th>Khách hàng ID</th>
                                    <th>Số Serial</th>
                                    <th>Mô tả lỗi</th>
                                    <th>Mức độ</th>
                                    <th>Trạng thái</th>
                                    <th>Hạn SLA</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map(ticket => (
                                    <tr key={ticket.ticket_id}>
                                        <td>{ticket.ticket_code}</td>
                                        <td>{ticket.customer_id}</td>
                                        {/* Hiển thị N/A nếu API chưa trả về các trường này */}
                                        <td>{ticket.serial_no || 'N/A'}</td>
                                        <td>{ticket.issue_desc}</td>
                                        <td>{ticket.priority}</td>
                                        <td>
                                            <span style={{ padding: '4px 8px', backgroundColor: '#177ddc', color: '#fff', borderRadius: '4px', fontSize: '12px' }}>
                                                {ticket.status || 'MỚI'}
                                            </span>
                                        </td>
                                        <td>{ticket.due_date || 'N/A'}</td>
                                        <td>
                                            <button style={{ padding: '4px 8px', cursor: 'pointer' }}>Chi tiết</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    );
                }}
            </DataState>
        </section>
    );
}