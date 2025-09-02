import React from 'react';

interface RecentlyViewedProps {
  items: any[];
  onClear?: () => void;
  showViewAll?: boolean;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ items, onClear, showViewAll }) => {
  return (
    <div className="recently-viewed">
      <div className="recently-viewed-header">
        <h3>Recently Viewed</h3>
        {showViewAll && (
          <a href="/recently-viewed" className="view-all-link">View All</a>
        )}
        {onClear && (
          <button className="clear-btn" onClick={onClear}>Clear</button>
        )}
      </div>
      <div className="recently-viewed-list">
        {items.length === 0 ? (
          <p>No recently viewed items.</p>
        ) : (
          <ul>
            {items.slice(0, showViewAll ? items.length : 5).map((item, idx) => (
              <li key={item.id || idx} className="recently-viewed-item">
                {/* Render item summary here, e.g. image, name, link */}
                <a href={`/products/${item.id}`}>{item.name || item.title}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecentlyViewed;
