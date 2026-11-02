import { useEffect } from 'react';

export function Toast({ toast, onClose }) {
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [toast, onClose]);

    if (!toast) return null;

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    return (
        <div className={`toast-notification toast-${toast.type || 'info'}`}>
            <span className="toast-icon">{icons[toast.type] || 'ℹ️'}</span>
            <div className="toast-content">
                <div className="toast-title">{toast.title || (toast.type === 'error' ? 'Lỗi' : 'Thông báo')}</div>
                <div className="toast-message">{toast.message}</div>
            </div>
            <button className="toast-close" onClick={onClose} aria-label="Đóng">✕</button>
        </div>
    );
}

