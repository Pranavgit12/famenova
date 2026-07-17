import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/api';

export default function Settings() {
  const { user } = useAuth();

  const [passwords, setPasswords] = useState({
    current: '',
    newPassword: '',
    confirm: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [notifications, setNotifications] = useState({
    newLeadEmail: true,
    statusChange: true,
    weeklyReport: false,
    dailyDigest: true,
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwords.current || !passwords.newPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (passwords.newPassword !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      await auth.updatePassword({
        currentPassword: passwords.current,
        newPassword: passwords.newPassword,
      });
      toast.success('Password updated');
      setPasswords({ current: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success('Preference saved');
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="settings-section">
        <h3 className="settings-section-title">Profile</h3>
        <div className="card">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={user?.name || ''}
              readOnly
              style={{ opacity: 0.7, cursor: 'default' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={user?.email || ''}
              readOnly
              style={{ opacity: 0.7, cursor: 'default' }}
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Change Password</h3>
        <div className="card">
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter current password"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter new password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Confirm new password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Notification Preferences</h3>
        <div className="card">
          <div className="toggle-row">
            <div className="toggle-info">
              <span className="toggle-label">New Lead Email</span>
              <span className="toggle-desc">Receive an email when a new lead is submitted</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.newLeadEmail}
                onChange={() => toggleNotification('newLeadEmail')}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="toggle-row">
            <div className="toggle-info">
              <span className="toggle-label">Status Change</span>
              <span className="toggle-desc">Get notified when a lead status is updated</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.statusChange}
                onChange={() => toggleNotification('statusChange')}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="toggle-row">
            <div className="toggle-info">
              <span className="toggle-label">Weekly Report</span>
              <span className="toggle-desc">Receive a weekly summary of leads and analytics</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.weeklyReport}
                onChange={() => toggleNotification('weeklyReport')}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="toggle-row">
            <div className="toggle-info">
              <span className="toggle-label">Daily Digest</span>
              <span className="toggle-desc">Daily summary of all activity in your dashboard</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.dailyDigest}
                onChange={() => toggleNotification('dailyDigest')}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
