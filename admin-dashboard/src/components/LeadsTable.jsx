import { getStatusColor, getStatusLabel, formatDate } from '../utils/helpers';

export default function LeadsTable({ leads, onRowClick, sortField, sortDir, onSort }) {
  const columns = [
    { key: 'fullName', label: 'Name' },
    { key: 'businessName', label: 'Business' },
    { key: 'phone', label: 'Phone' },
    { key: 'niche', label: 'Niche' },
    { key: 'status', label: 'Status' },
    { key: 'submittedAt', label: 'Submitted' },
  ];

  const renderSortIndicator = (key) => {
    if (sortField !== key) return '';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  };

  if (!leads || leads.length === 0) {
    return (
      <div className="table-empty">
        <div className="table-empty-icon">📭</div>
        <div>No leads found</div>
      </div>
    );
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={sortField === col.key ? 'sorted' : ''}
              onClick={() => onSort(col.key)}
            >
              {col.label}
              {renderSortIndicator(col.key)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead.id} onClick={() => onRowClick(lead)}>
            <td style={{ fontWeight: 500 }}>{lead.fullName}</td>
            <td style={{ color: 'var(--text-secondary)' }}>{lead.businessName}</td>
            <td style={{ color: 'var(--text-secondary)' }}>{lead.phone}</td>
            <td>{lead.niche || '—'}</td>
            <td>
              <span className={`badge badge-${getStatusColor(lead.status)}`}>
                {getStatusLabel(lead.status)}
              </span>
            </td>
            <td style={{ color: 'var(--text-secondary)' }}>{formatDate(lead.submittedAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
