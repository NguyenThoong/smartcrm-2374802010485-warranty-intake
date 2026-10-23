export function DataState({ loading, error, data, empty, children }) {
    if (loading) return <div className="skeleton">Đang tải dữ liệu...</div>;
    
    if (error) return (
        <div className="alert alert-error" style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
            <p>Mất kết nối tới hệ thống: {error.message}</p>
            <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
    );
    
    const rong = !data || (Array.isArray(data) && data.length === 0);
    if (rong) return (
        <div className="empty-state" style={{ padding: '20px', textAlign: 'center' }}>
            <p>{empty?.message || 'Chưa có dữ liệu nào.'}</p>
            {empty?.action}
        </div>
    );
    
    return children(data);
}