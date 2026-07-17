import { getStatusColor, getStatusLabel, formatDate } from '../utils/helpers';

export default function LeadsTable({ leads, onRowClick, sortField, sortDir, onSort }) {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'niche', label: 'Niche' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created' },
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
          <tr key={lead._id || lead.id} onClick={() => onRowClick(lead)}>
            <td style={{ fontWeight: 500 }}>{lead.name}</td>
            <td style={{ color: 'var(--text-secondary)' }}>{lead.email}</td>
            <td>{lead.niche || '—'}</td>
            <td>
              <span className={`badge badge-${getStatusColor(lead.status)}`}>
                {getStatusLabel(lead.status)}
              </span>
            </td>
            <td style={{ color: 'var(--text-secondary)' }}>{formatDate(lead.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
