import React from 'react';
import { Star, RotateCcw, Check } from 'lucide-react';
import { Category, ProductFilterState } from '../../types';

interface FilterSidebarProps {
  categories: Category[];
  brands: string[];
  filters: ProductFilterState;
  onFilterChange: (filters: Partial<ProductFilterState>) => void;
  onReset: () => void;
  className?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  brands,
  filters,
  onFilterChange,
  onReset,
  className = '',
}) => {
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'];
  const colors = [
    { name: 'Black', hex: '#171717' },
    { name: 'Camel', hex: '#C19A6B' },
    { name: 'Heather Grey', hex: '#9E9E9E' },
    { name: 'Navy', hex: '#1B263B' },
    { name: 'White', hex: '#F5F5F5' },
    { name: 'Olive', hex: '#556B2F' },
    { name: 'Champagne', hex: '#F7E7CE' },
    { name: 'Indigo', hex: '#2E4057' },
  ];

  return (
    <aside className={`bg-white rounded-lg border border-neutral-200 p-5 space-y-6 text-neutral-800 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <h3 className="font-semibold text-sm text-neutral-900 tracking-wide uppercase font-mono">Filters</h3>
        <button
          onClick={onReset}
          className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider font-mono">Category</h4>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange({ categoryId: undefined, categoryName: undefined, page: 0 })}
            className={`w-full text-left text-xs py-1.5 px-2.5 rounded transition-colors flex items-center justify-between ${
              !filters.categoryId && !filters.categoryName
                ? 'bg-neutral-900 text-white font-medium'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => {
            const isSelected =
              filters.categoryId === cat.id ||
              filters.categoryName?.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() =>
                  onFilterChange({
                    categoryId: cat.id,
                    categoryName: cat.name,
                    page: 0,
                  })
                }
                className={`w-full text-left text-xs py-1.5 px-2.5 rounded transition-colors flex items-center justify-between ${
                  isSelected ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>{cat.name}</span>
                {cat.productCount !== undefined && (
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-neutral-300' : 'text-neutral-400'}`}>
                    {cat.productCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3 pt-3 border-t border-neutral-100">
        <div className="flex items-center justify-between text-xs">
          <h4 className="font-semibold text-neutral-900 uppercase tracking-wider font-mono">Max Price</h4>
          <span className="font-mono font-bold text-neutral-900 tabular-nums">
            ${filters.maxPrice ?? 350}
          </span>
        </div>
        <input
          type="range"
          min="20"
          max="350"
          step="10"
          value={filters.maxPrice ?? 350}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value), page: 0 })}
          className="w-full accent-neutral-900 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-neutral-400">
          <span>$20</span>
          <span>$350+</span>
        </div>
      </div>

      {/* Brand Selection */}
      <div className="space-y-2 pt-3 border-t border-neutral-100">
        <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider font-mono">Brand</h4>
        <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
          {brands.map((b) => (
            <label
              key={b}
              className="flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-900 cursor-pointer py-1"
            >
              <input
                type="checkbox"
                checked={filters.brand?.toLowerCase() === b.toLowerCase()}
                onChange={(e) =>
                  onFilterChange({
                    brand: e.target.checked ? b : undefined,
                    page: 0,
                  })
                }
                className="rounded border-neutral-300 text-neutral-900 focus:ring-0 cursor-pointer"
              />
              <span className="truncate">{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-2 pt-3 border-t border-neutral-100">
        <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider font-mono">Size</h4>
        <div className="grid grid-cols-4 gap-1.5">
          {sizes.map((s) => {
            const isSelected = filters.size === s;
            return (
              <button
                key={s}
                onClick={() => onFilterChange({ size: isSelected ? undefined : s, page: 0 })}
                className={`py-1.5 text-xs font-mono font-medium rounded border transition-colors ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-2 pt-3 border-t border-neutral-100">
        <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider font-mono">Color</h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => {
            const isSelected = filters.color?.toLowerCase() === c.name.toLowerCase();
            return (
              <button
                key={c.name}
                onClick={() => onFilterChange({ color: isSelected ? undefined : c.name, page: 0 })}
                title={c.name}
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                  isSelected ? 'ring-2 ring-neutral-900 ring-offset-2 scale-110' : 'border-neutral-300'
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-3 h-3 ${['#171717', '#1B263B', '#556B2F', '#2E4057'].includes(c.hex) ? 'text-white' : 'text-neutral-900'}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2 pt-3 border-t border-neutral-100">
        <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider font-mono">Minimum Rating</h4>
        <div className="space-y-1">
          {[4.5, 4.0, 3.5].map((stars) => {
            const isSelected = filters.minRating === stars;
            return (
              <button
                key={stars}
                onClick={() => onFilterChange({ minRating: isSelected ? undefined : stars, page: 0 })}
                className={`w-full text-left text-xs py-1.5 px-2 rounded flex items-center gap-1.5 transition-colors ${
                  isSelected ? 'bg-neutral-100 font-semibold text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                </div>
                <span>{stars} Stars & Above</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
