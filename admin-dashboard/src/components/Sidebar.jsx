import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getInitials } from '../utils/helpers';

const navItems = [
  { to: '/', icon: '◈', label: 'Dashboard' },
  { to: '/leads', icon: '◉', label: 'Leads' },
  { to: '/analytics', icon: '◎', label: 'Analytics' },
  { to: '/settings', icon: '⚙', label: 'Settings' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'visible' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">F</div>
          <span className="sidebar-logo-text">FAMENOVA Admin</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `sidebar-link${isActive || (item.to !== '/' && location.pathname.startsWith(item.to)) ? ' active' : ''}`
              }
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{getInitials(user?.name)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'Admin'}</div>
              <div className="sidebar-user-email">{user?.email || ''}</div>
            </div>
          </div>
          <button
            className="sidebar-logout"
            onClick={logout}
          >
            <span className="sidebar-link-icon">⏻</span>
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
