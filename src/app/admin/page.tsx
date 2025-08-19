"use client";
import React from 'react';
import Link from 'next/link';

const AdminDashboard = () => {
  const dashboardCards = [
    {
      title: 'Category Management',
      description: 'Create and manage product categories',
      href: '/admin/categories',
      icon: '📁',
      color: 'blue'
    },
    {
      title: 'Product Management',
      description: 'Manage products and listings',
      href: '/admin/products',
      icon: '📦',
      color: 'green'
    },
    {
      title: 'User Management',
      description: 'Manage users and vendors',
      href: '/admin/users',
      icon: '👥',
      color: 'purple'
    },
    {
      title: 'Order Management',
      description: 'View and manage orders',
      href: '/admin/orders',
      icon: '🛒',
      color: 'orange'
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your marketplace from here</p>
      </div>

      <div className="dashboard-grid">
        {dashboardCards.map((card) => (
          <Link key={card.href} href={card.href} className={`dashboard-card ${card.color}`}>
            <div className="card-icon">{card.icon}</div>
            <div className="card-content">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
            <div className="card-arrow">→</div>
          </Link>
        ))}
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">📁</span>
            <span className="activity-text">New category "Smartphones" created</span>
            <span className="activity-time">2 hours ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">📦</span>
            <span className="activity-text">Product "iPhone 15 Pro" published</span>
            <span className="activity-time">4 hours ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🛒</span>
            <span className="activity-text">New order #12345 received</span>
            <span className="activity-time">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
