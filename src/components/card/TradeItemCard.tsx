import React from 'react';
import { TradeItem } from '@/types/api';

interface TradeItemCardProps {
  item: TradeItem;
  isSelected: boolean;
  onSelect: (item: TradeItem) => void;
}

const TradeItemCard: React.FC<TradeItemCardProps> = ({ item, isSelected, onSelect }) => {
  return (
    <div 
      className={`trade-item-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(item)}
    >
      <div className="trade-card-image">
        <img src={item.image} alt={item.name} />
        <div className="trade-badge">TRADE</div>
      </div>
      
      <div className="trade-card-content">
        <h4 className="trade-item-name">{item.name}</h4>
        <p className="trade-item-condition">{item.condition}</p>
        <p className="trade-item-value">Value: GH₵{item.estimatedValue}</p>
        <p className="trade-item-looking">Looking for: {item.lookingFor}</p>
        <div className="trade-item-meta">
          <span className="trade-item-location">{item.location}</span>
          <span className="trade-item-seller">by {item.seller}</span>
        </div>
      </div>
      
      {isSelected && (
        <div className="selection-indicator">
          <span>✓</span>
        </div>
      )}
    </div>
  );
};

export default TradeItemCard;
