import { useState } from 'react';
import toast from 'react-hot-toast';
import { leads } from '../services/api';
import { getStatusLabel, formatDateTime } from '../utils/helpers';

export default function LeadDetailModal({ lead, onClose, onUpdate }) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await leads.update(lead.id, { status, notes });
      toast.success('Lead updated');
      onUpdate({ ...lead, status, notes });
      onClose();
    } catch {
      toast.error('Failed to update lead');
    } finally {
      setSaving(false);
    }
  };

  const timeline = [
    { action: 'Lead created', date: lead.submittedAt },
    ...(lead.status !== 'new'
      ? [{ action: `Status changed to ${lead.status}`, date: lead.submittedAt }]
      : []),
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{lead.fullName}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{lead.phone || '—'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Business</span>
              <span className="detail-value">{lead.businessName || '—'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Niche</span>
              <span className="detail-value">{lead.niche || '—'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Location</span>
              <span className="detail-value">{lead.location || '—'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className="detail-value">{getStatusLabel(lead.status)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Submitted</span>
              <span className="detail-value">{lead.submittedAt || '—'}</span>
            </div>
            <div className="detail-item full-width">
              <span className="detail-label">Notes</span>
              <span className="detail-value">{lead.notes || 'No notes'}</span>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Add notes about this lead..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="timeline">
            <div className="timeline-title">Timeline</div>
            {timeline.map((item, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-dot">●</div>
                <div className="timeline-content">
                  <div className="timeline-text">{item.action}</div>
                  <div className="timeline-time">{formatDateTime(item.date)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
