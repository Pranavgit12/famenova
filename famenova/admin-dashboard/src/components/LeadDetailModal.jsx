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
      await leads.update(lead._id || lead.id, { status, notes });
      toast.success('Lead updated');
      onUpdate({ ...lead, status, notes });
      onClose();
    } catch {
      toast.error('Failed to update lead');
    } finally {
      setSaving(false);
    }
  };

  const timeline = lead.timeline || [
    { action: 'Lead created', date: lead.createdAt },
    ...(lead.status !== 'new'
      ? [{ action: `Status changed to ${lead.status}`, date: lead.updatedAt }]
      : []),
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{lead.name}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{lead.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{lead.phone || '—'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Company</span>
              <span className="detail-value">{lead.company || '—'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Niche</span>
              <span className="detail-value">{lead.niche || '—'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Budget</span>
              <span className="detail-value">{lead.budget || '—'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Location</span>
              <span className="detail-value">{lead.location || '—'}</span>
            </div>
            <div className="detail-item full-width">
              <span className="detail-label">Message</span>
              <span className="detail-value">{lead.message || 'No message provided'}</span>
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
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
                <option value="lost">Lost</option>
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
