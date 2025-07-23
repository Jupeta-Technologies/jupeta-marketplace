import React from 'react';
import styles from '@/styles/ProductFilterSidebar.module.css';

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
    <aside className={styles.sidebar}>
      <h3 className={styles.heading}>Filter Products</h3>
      <div className={styles.sectionSpacing}>
        <label className={styles.categoryLabel}>Category</label>
        <ul className={styles.categoryList}>
          <li className={styles.categoryItem}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ''}
                onChange={() => onCategoryChange('')}
                className={styles.radioInput}
              />
              All
            </label>
          </li>
          {FIXED_CATEGORIES.map(cat => (
            <li key={cat} className={styles.categoryItem}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={selectedCategory === cat}
                  onChange={() => onCategoryChange(cat)}
                  className={styles.radioInput}
                />
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.sectionSpacing}>
        <label className={styles.conditionLabel}>Condition</label>
        <ul className={styles.conditionList}>
          <li className={styles.conditionItem}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="condition"
                value=""
                checked={selectedCondition === ''}
                onChange={() => onConditionChange('')}
                className={styles.radioInput}
              />
              All
            </label>
          </li>
          {CONDITION_OPTIONS.map(cond => (
            <li key={cond} className={styles.conditionItem}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="condition"
                  value={cond}
                  checked={selectedCondition === cond}
                  onChange={() => onConditionChange(cond)}
                  className={styles.radioInput}
                />
                {cond.charAt(0).toUpperCase() + cond.slice(1)}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.sectionSpacing}>
        <label className={styles.typeLabel}>Type</label>
        <ul className={styles.typeList}>
          <li className={styles.typeItem}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="type"
                value=""
                checked={selectedType === ''}
                onChange={() => onTypeChange('')}
                className={styles.radioInput}
              />
              All
            </label>
          </li>
          {TYPE_OPTIONS.map(type => (
            <li key={type} className={styles.typeItem}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={selectedType === type}
                  onChange={() => onTypeChange(type)}
                  className={styles.radioInput}
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label className={styles.priceLabel}>Price Range</label>
        <div className={styles.priceInputs}>
          <input
            type="number"
            min={min}
            max={selectedMax}
            value={selectedMin}
            onChange={e => onPriceRangeChange([Number(e.target.value), selectedMax])}
            className={styles.priceInput}
            placeholder="Min"
          />
          <span>-</span>
          <input
            type="number"
            min={selectedMin}
            max={max}
            value={selectedMax}
            onChange={e => onPriceRangeChange([selectedMin, Number(e.target.value)])}
            className={styles.priceInput}
            placeholder="Max"
          />
        </div>
      </div>
      <button onClick={onReset} className={styles.resetBtn}>Reset Filters</button>
    </aside>
  );
};

export default ProductFilterSidebar; 