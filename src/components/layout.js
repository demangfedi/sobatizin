import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const shellStyles = {
  display: 'grid',
  gridTemplateColumns: '220px 1fr',
  minHeight: '100vh',
  backgroundColor: '#f5f6fa',
  color: '#1f2a44'
};

const sidebarStyles = {
  backgroundColor: '#1f2a44',
  color: '#fff',
  padding: '24px 16px'
};

const navStyles = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: '12px'
};

const linkStyles = {
  display: 'block',
  padding: '10px 12px',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#e6ecff',
  fontWeight: 500
};

const activeLinkStyles = {
  ...linkStyles,
  backgroundColor: '#4f6bed',
  color: '#fff'
};

const contentStyles = {
  padding: '32px 40px'
};

const headerStyles = {
  margin: '0 0 24px',
  fontSize: '24px',
  fontWeight: 700
};

const navItems = [
  { to: '/admin/settings', label: 'Settings' },
  { to: '/admin/services', label: 'Services' }
];

function AdminLayout({ title, children }) {
  return (
    <div style={shellStyles}>
      <aside style={sidebarStyles}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Sobat Izin Admin</h1>
        <ul style={navStyles}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                style={({ isActive }) => (isActive ? activeLinkStyles : linkStyles)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
      <main style={contentStyles}>
        {title ? <h2 style={headerStyles}>{title}</h2> : null}
        {children || <Outlet />}
      </main>
    </div>
  );
}

export default AdminLayout;
