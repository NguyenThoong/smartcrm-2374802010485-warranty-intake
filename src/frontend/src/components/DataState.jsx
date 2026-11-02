export function DataState({ loading, error, data, empty, onRetry, children }) {
    if (loading) {
        return (
            <div className="state-card loading-state">
                <div className="spinner"></div>
                <p className="state-title">Đang đồng bộ dữ liệu từ hệ thống SmartCRM...</p>
                <div className="skeleton-table">
                    <div className="skeleton-row"></div>
                    <div className="skeleton-row"></div>
                    <div className="skeleton-row"></div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="state-card error-state">
                <div className="state-icon error-icon">⚠️</div>
                <h4 className="state-title">Không thể tải dữ liệu</h4>
                <p className="state-desc">{error.message || 'Mất kết nối tới hệ thống máy chủ backend. Vui lòng kiểm tra lại dịch vụ.'}</p>
                <button 
                    className="btn btn-secondary" 
                    onClick={() => onRetry ? onRetry() : window.location.reload()}
                >
                    🔄 Thử tải lại
                </button>
            </div>
        );
    }
    
    const isEmpty = !data || (Array.isArray(data) && data.length === 0);
    if (isEmpty) {
        return (
            <div className="state-card empty-state">
                <div className="state-icon empty-icon">📋</div>
                <h4 className="state-title">{empty?.title || 'Chưa có phiếu bảo hành nào'}</h4>
                <p className="state-desc">{empty?.message || 'Không tìm thấy bản ghi nào phù hợp với bộ lọc hiện tại.'}</p>
                {empty?.action && <div className="state-action">{empty.action}</div>}
            </div>
        );
    }
    
    return children(data);
}
