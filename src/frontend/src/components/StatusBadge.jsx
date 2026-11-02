import { STATUS_CONFIG, PRIORITY_CONFIG } from '../utils/constants';

export function StatusBadge({ status }) {
    const key = String(status || '').toUpperCase();
    const config = STATUS_CONFIG[key] || { label: status || 'MỚI', className: 'badge-default', dotColor: '#64748b' };

    return (
        <span className={`status-badge ${config.className}`}>
            <span className="badge-dot" style={{ backgroundColor: config.dotColor }}></span>
            {config.label}
        </span>
    );
}

export function PriorityBadge({ priority }) {
    const key = String(priority || '').toUpperCase();
    const config = PRIORITY_CONFIG[key] || { label: priority || 'Trung bình', className: 'priority-trung-binh' };

    return (
        <span className={`priority-badge ${config.className}`}>
            {config.label}
        </span>
    );
}
