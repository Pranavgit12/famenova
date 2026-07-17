import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return format(d, 'MMM d, yyyy');
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return format(d, 'MMM d, yyyy h:mm a');
}

export function formatRelative(dateStr) {
  if (!dateStr) return '—';
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString();
}

export function getStatusColor(status) {
  const map = {
    new: 'blue',
    contacted: 'yellow',
    qualified: 'purple',
    closed: 'emerald',
    lost: 'red',
  };
  return map[status] || 'blue';
}

export function getStatusLabel(status) {
  const map = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    closed: 'Closed',
    lost: 'Lost',
  };
  return map[status] || status;
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
