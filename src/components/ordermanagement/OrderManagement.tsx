import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { Package, Truck, CheckCircle, Clock, Eye, Download } from 'lucide-react';

import laptop from '@/assets/images/laptop.jpg';

interface Order {
  id: string;
  itemName: string;
  itemImage: string | StaticImageData;
  totalCost: number;
  quantity: number;
  orderDate: string;
  estimatedDelivery: string;
  deliveryStatus: 'Paid' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  trackingNumber?: string;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    itemName: 'Apple MacBook Pro 14" M3 Chip',
    itemImage: laptop,
    totalCost: 2499.99,
    quantity: 1,
    orderDate: '2024-08-10',
    estimatedDelivery: '2024-08-15',
    deliveryStatus: 'Shipped',
    trackingNumber: 'TRK1234567890',
  },
  {
    id: 'ORD-2024-002',
    itemName: 'Sony WH-1000XM5 Noise Canceling Headphones',
    itemImage: laptop, // Using laptop as placeholder
    totalCost: 399.99,
    quantity: 1,
    orderDate: '2024-08-12',
    estimatedDelivery: '2024-08-14',
    deliveryStatus: 'Out for Delivery',
    trackingNumber: 'TRK0987654321',
  },
  {
    id: 'ORD-2024-003',
    itemName: 'Samsung Galaxy S24 Ultra 256GB',
    itemImage: laptop, // Using laptop as placeholder
    totalCost: 999.99,
    quantity: 1,
    orderDate: '2024-08-08',
    estimatedDelivery: '2024-08-12',
    deliveryStatus: 'Delivered',
    trackingNumber: 'TRK1122334455',
  },
  {
    id: 'ORD-2024-004',
    itemName: 'Apple AirPods Pro (2nd Gen)',
    itemImage: laptop, // Using laptop as placeholder
    totalCost: 249.99,
    quantity: 2,
    orderDate: '2024-08-13',
    estimatedDelivery: '2024-08-18',
    deliveryStatus: 'Paid',
  },
];

const statusSteps = [
  { 
    key: 'Paid', 
    label: 'Order Confirmed', 
    icon: CheckCircle,
    description: 'Your order has been confirmed and payment processed'
  },
  { 
    key: 'Shipped', 
    label: 'Shipped', 
    icon: Package,
    description: 'Your order has been shipped and is on its way'
  },
  { 
    key: 'Out for Delivery', 
    label: 'Out for Delivery', 
    icon: Truck,
    description: 'Your order is out for delivery and will arrive soon'
  },
  { 
    key: 'Delivered', 
    label: 'Delivered', 
    icon: CheckCircle,
    description: 'Your order has been successfully delivered'
  },
];

const getStatusIndex = (status: Order['deliveryStatus']) => {
  return statusSteps.findIndex((step) => step.key === status);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const OrderManagement: React.FC = () => {
  const [filter, setFilter] = useState<'all' | Order['deliveryStatus']>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate initial load
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  // Simulate loading when filter changes
  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [filter]);

  const filteredOrders = filter === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.deliveryStatus === filter);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="order-management">
      {/* Filter Bar */}
      <div className="order-filters">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders ({mockOrders.length})
          </button>
          {statusSteps.map(step => {
            const count = mockOrders.filter(order => order.deliveryStatus === step.key).length;
            return (
              <button 
                key={step.key}
                className={`filter-btn ${filter === step.key ? 'active' : ''}`}
                onClick={() => setFilter(step.key as Order['deliveryStatus'])}
              >
                {step.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="order-card skeleton">
              <div className="order-header">
                <div className="order-info">
                  <span className="sk sk-title" />
                  <span className="sk sk-subtitle" />
                </div>
                <div className="order-status">
                  <span className="sk sk-badge" />
                </div>
              </div>

              <div className="order-content">
                <div className="product-info">
                  <div className="product-image">
                    <span className="sk sk-avatar" />
                  </div>
                  <div className="product-details">
                    <span className="sk sk-line w-60" />
                    <span className="sk sk-line w-40" />
                    <span className="sk sk-line w-30" />
                  </div>
                </div>
                <div className="order-actions">
                  <span className="sk sk-btn" />
                  <span className="sk sk-btn" />
                </div>
              </div>

              <div className="progress-tracker">
                <div className="progress-header">
                  <span className="sk sk-line w-30" />
                  <span className="sk sk-badge w-20" />
                </div>
                <div className="progress-line">
                  <div className="progress-fill" style={{ width: '55%' }}>
                    <span className="progress-sheen" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <Package size={48} className="empty-icon" />
            <h3 className="empty-title">No orders found</h3>
            <p className="empty-description">
              {filter === 'all' 
                ? "You haven't placed any orders yet." 
                : `No orders with status "${filter}" found.`}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-card-container">
              <div className="order-card">
                {/* Order Header */}
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-id">Order #{order.id}</span>
                    <span className="order-date">Placed on {formatDate(order.orderDate)}</span>
                    {order.trackingNumber && (
                      <span className="tracking-number">Tracking: {order.trackingNumber}</span>
                    )}
                  </div>
                  <div className="order-status">
                    {order.deliveryStatus === 'Delivered' ? (
                      <div className="status-delivered">
                        <CheckCircle size={16} />
                        <span>Delivered</span>
                      </div>
                    ) : (
                      <div className={`status-badge status-${order.deliveryStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Clock size={16} />
                        <span>{order.deliveryStatus}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Content */}
                <div className="order-content">
                  <div className="product-info">
                    <div className="product-image">
                      <Image
                        src={order.itemImage}
                        alt={order.itemName}
                        width={64}
                        height={64}
                        loading="lazy"
                      />
                    </div>
                    <div className="product-details">
                      <h3 className="product-name">{order.itemName}</h3>
                      <div className="product-meta">
                        <span className="quantity">Qty: {order.quantity}</span>
                        <span className="price">${order.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="delivery-info">
                        <span className="delivery-date">
                          Expected: {formatDate(order.estimatedDelivery)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
          <div className="order-actions">
                    <button 
                      className="action-btn primary"
            onClick={() => toggleOrderDetails(order.id)}
            aria-expanded={expandedOrder === order.id}
            aria-controls={`order-details-${order.id}`}
                    >
                      <Eye size={16} />
                      {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                    </button>
                    {order.trackingNumber && (
                      <button className="action-btn secondary">
                        <Truck size={16} />
                        Track Order
                      </button>
                    )}
                    <button className="action-btn">
                      <Download size={16} />
                      Invoice
                    </button>
                  </div>
                </div>

                {/* Progress Tracker */}
                <div
                  className="progress-tracker"
                  role="progressbar"
                  aria-label={`Order progress for ${order.id}`}
                  aria-valuemin={0}
                  aria-valuemax={statusSteps.length - 1}
                  aria-valuenow={getStatusIndex(order.deliveryStatus)}
                  aria-valuetext={order.deliveryStatus}
                >
                  <div className="progress-header">
                    <h4 className="progress-title">Order Progress</h4>
                    <div className="progress-status">
                      <span className="status-text">{order.deliveryStatus}</span>
                    </div>
                  </div>
                  
                  {/* Bar with markers */}
                  <div className="progress-line" aria-hidden="true">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(getStatusIndex(order.deliveryStatus) / (statusSteps.length - 1)) * 100}%` 
                      }}
                    >
                      {order.deliveryStatus !== 'Delivered' && (
                        <span className="progress-sheen" />
                      )}
                    </div>
                    {statusSteps.map((step, index) => {
                      const currentIndex = getStatusIndex(order.deliveryStatus);
                      const isActive = index <= currentIndex;
                      const isCurrent = index === currentIndex;
                      const left = `${(index / (statusSteps.length - 1)) * 100}%`;
                      return (
                        <span
                          key={step.key}
                          className={`progress-marker ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                          style={{ left }}
                        />
                      );
                    })}
                  </div>

                  {/* Labels beneath the bar, centered to markers */}
                  <div className="progress-labels" aria-hidden="true">
                    {statusSteps.map((step, index) => {
                      const currentIndex = getStatusIndex(order.deliveryStatus);
                      const stateClass = index === currentIndex ? 'current' : index < currentIndex ? 'active' : '';
                      const left = `${(index / (statusSteps.length - 1)) * 100}%`;
                      return (
                        <div key={step.key} className={`progress-label ${stateClass}`} style={{ left }}>
                          <span className="step-label">{step.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              {/* Progress Tracker - Already moved before content above */}

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="order-details" id={`order-details-${order.id}`}>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Order ID</span>
                      <span className="detail-value">{order.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Order Date</span>
                      <span className="detail-value">{formatDate(order.orderDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Estimated Delivery</span>
                      <span className="detail-value">{formatDate(order.estimatedDelivery)}</span>
                    </div>
                    {order.trackingNumber && (
                      <div className="detail-item">
                        <span className="detail-label">Tracking Number</span>
                        <span className="detail-value">{order.trackingNumber}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-label">Status</span>
                      <span className="detail-value">{order.deliveryStatus}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Amount</span>
                      <span className="detail-value total">${order.totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Status Description */}
                  <div className="status-description">
                    <p>{statusSteps[getStatusIndex(order.deliveryStatus)]?.description}</p>
                  </div>
                </div>
              )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
