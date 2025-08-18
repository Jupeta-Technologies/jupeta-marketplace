import React from 'react';

interface ProductFilterSidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  selectedPriceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onReset: () => void;
  selectedCondition?: string;
  onConditionChange?: (condition: string) => void;
  selectedType?: string;
  onTypeChange?: (type: string) => void;
}

const FIXED_CATEGORIES = [
  'home and kitchen',
  'electronic',
  'Automotive',
  'fashion',
];
const CONDITION_OPTIONS = ['new', 'used', 'refurbrished'];
const TYPE_OPTIONS = ['buy now', 'auction'];

const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  selectedCategory,
  onCategoryChange,
  priceRange,
  selectedPriceRange,
  onPriceRangeChange,
  onReset,
  selectedCondition = '',
  onConditionChange = () => {},
  selectedType = '',
  onTypeChange = () => {},
}) => {
  const [min, max] = priceRange;
  const [selectedMin, selectedMax] = selectedPriceRange;

  return (
    <aside className="pfs">
      <h3 className="pfs__heading">Filter Products</h3>
      <div className="pfs__section">
        <label className="pfs__label">Category</label>
        <ul className="pfs__list">
          <li className="pfs__item">
            <label className="pfs__radioLabel">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ''}
                onChange={() => onCategoryChange('')}
                className="pfs__radioInput"
              />
              All
            </label>
          </li>
          {FIXED_CATEGORIES.map(cat => (
            <li key={cat} className="pfs__item">
              <label className="pfs__radioLabel">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={selectedCategory === cat}
                  onChange={() => onCategoryChange(cat)}
                  className="pfs__radioInput"
                />
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="pfs__section">
        <label className="pfs__label">Condition</label>
        <ul className="pfs__list">
          <li className="pfs__item">
            <label className="pfs__radioLabel">
              <input
                type="radio"
                name="condition"
                value=""
                checked={selectedCondition === ''}
                onChange={() => onConditionChange('')}
                className="pfs__radioInput"
              />
              All
            </label>
          </li>
          {CONDITION_OPTIONS.map(cond => (
            <li key={cond} className="pfs__item">
              <label className="pfs__radioLabel">
                <input
                  type="radio"
                  name="condition"
                  value={cond}
                  checked={selectedCondition === cond}
                  onChange={() => onConditionChange(cond)}
                  className="pfs__radioInput"
                />
                {cond.charAt(0).toUpperCase() + cond.slice(1)}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="pfs__section">
        <label className="pfs__label">Type</label>
        <ul className="pfs__list">
          <li className="pfs__item">
            <label className="pfs__radioLabel">
              <input
                type="radio"
                name="type"
                value=""
                checked={selectedType === ''}
                onChange={() => onTypeChange('')}
                className="pfs__radioInput"
              />
              All
            </label>
          </li>
          {TYPE_OPTIONS.map(type => (
            <li key={type} className="pfs__item">
              <label className="pfs__radioLabel">
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={selectedType === type}
                  onChange={() => onTypeChange(type)}
                  className="pfs__radioInput"
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="pfs__section">
        <label className="pfs__label">Price Range</label>
        <div className="pfs__priceInputs">
          <input
            type="number"
            min={min}
            max={selectedMax}
            value={selectedMin}
            onChange={e => onPriceRangeChange([Number(e.target.value), selectedMax])}
            className="pfs__priceInput"
            placeholder="Min"
          />
          <span className="pfs__dash">-</span>
          <input
            type="number"
            min={selectedMin}
            max={max}
            value={selectedMax}
            onChange={e => onPriceRangeChange([selectedMin, Number(e.target.value)])}
            className="pfs__priceInput"
            placeholder="Max"
          />
        </div>
      </div>
      <button onClick={onReset} className="pfs__resetBtn">Reset Filters</button>
    </aside>
  );
};

export default ProductFilterSidebar; 