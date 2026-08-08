import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './styles/admin.css';

const BASENAME = window.location.pathname.startsWith('/admin') ? '/admin' : '/';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={BASENAME}>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a2e',
              color: '#e2e8f0',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#1a1a2e' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#1a1a2e' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
