"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: '📊'
    },
    {
      href: '/admin/categories',
      label: 'Categories',
      icon: '📁'
    },
    {
      href: '/admin/products',
      label: 'Products',
      icon: '📦'
    },
    {
      href: '/admin/users',
      label: 'Users',
      icon: '👥'
    },
    {
      href: '/admin/orders',
      label: 'Orders',
      icon: '🛒'
    }
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <Link href="/" className="back-to-site">
            ← Back to Site
          </Link>
        </div>
        
        <nav className="admin-navigation">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
