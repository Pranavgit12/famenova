import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { getInitials } from '../utils/helpers';

const pageTitles = {
  '/': 'Dashboard',
  '/leads': 'Leads',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const title =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith('/leads') ? 'Leads' : 'Dashboard');

  return (
    <div className="dashboard-layout">
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        <header className="header">
          <h1 className="header-title">{title}</h1>
          <div className="header-right">
            <div className="header-user">
              <span className="header-user-name">{user?.name}</span>
              <div className="header-avatar">{getInitials(user?.name)}</div>
            </div>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
