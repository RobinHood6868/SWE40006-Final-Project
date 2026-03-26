import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export default function ProductFilters({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  rating,
  onRatingChange,
  inStockOnly,
  onInStockChange,
  sortBy,
  onSortChange,
  isOpen,
  onToggle,
  onClear
}) {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    stock: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleApplyPriceRange = () => {
    onPriceRangeChange(localPriceRange);
  };

  const sortOptions = [
    { value: 'default', label: 'Mặc định' },
    { value: 'price-asc', label: 'Giá: Thấp đến Cao' },
    { value: 'price-desc', label: 'Giá: Cao đến Thấp' },
    { value: 'rating', label: 'Đánh giá cao nhất' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'best-selling', label: 'Bán chạy nhất' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header - Mobile */}
      <div className="lg:hidden p-4 border-b border-gray-100">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between text-sm font-medium text-gray-700"
        >
          <span className="flex items-center gap-2">
            <Filter size={16} />
            Bộ lọc
            {hasActiveFilters() && (
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
            )}
          </span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Content */}
      <div className={clsx(
        'transition-all duration-300',
        isOpen ? 'block' : 'hidden lg:block'
      )}>
        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <button
              onClick={() => toggleSection('categories')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Danh mục</h3>
              {expandedSections.categories ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {expandedSections.categories && (
              <div className="space-y-2">
                <button
                  onClick={() => onCategoryChange('')}
                  className={clsx(
                    'w-full text-left text-sm px-3 py-2 rounded-lg transition-colors',
                    selectedCategory === ''
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  Tất cả sản phẩm
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => onCategoryChange(cat.slug)}
                    className={clsx(
                      'w-full text-left text-sm px-3 py-2 rounded-lg transition-colors',
                      selectedCategory === cat.slug
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {cat.name}
                    <span className="float-right text-gray-400 text-xs">({cat.product_count || 0})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div>
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Khoảng giá</h3>
              {expandedSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {expandedSections.price && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Từ"
                    value={localPriceRange.min || ''}
                    onChange={(e) => setLocalPriceRange({ ...localPriceRange, min: Number(e.target.value) })}
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Đến"
                    value={localPriceRange.max || ''}
                    onChange={(e) => setLocalPriceRange({ ...localPriceRange, max: Number(e.target.value) })}
                    className="text-sm"
                  />
                </div>
                <Button
                  onClick={handleApplyPriceRange}
                  size="sm"
                  className="w-full"
                >
                  Áp dụng
                </Button>
                {/* Price Slider Visualization */}
                <div className="pt-2">
                  <div className="relative h-1 bg-gray-200 rounded-full">
                    <div
                      className="absolute h-full bg-blue-600 rounded-full"
                      style={{
                        left: `${(localPriceRange.min || 0) / 500000 * 100}%`,
                        right: `${100 - (localPriceRange.max || 50000000) / 50000000 * 100}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>0₫</span>
                    <span>50M₫</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rating */}
          <div>
            <button
              onClick={() => toggleSection('rating')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Đánh giá</h3>
              {expandedSections.rating ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {expandedSections.rating && (
              <div className="space-y-2">
                {[4, 3, 2, 1].map(stars => (
                  <button
                    key={stars}
                    onClick={() => onRatingChange(rating === stars ? null : stars)}
                    className={clsx(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                      rating === stars
                        ? 'bg-blue-50 border-blue-200 border'
                        : 'hover:bg-gray-50'
                    )}
                  >
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={clsx(
                            i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">& trở lên</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* In Stock Only */}
          <div>
            <button
              onClick={() => toggleSection('stock')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Trạng thái</h3>
              {expandedSections.stock ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {expandedSections.stock && (
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => onInStockChange(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={clsx(
                    'w-5 h-5 rounded border-2 transition-colors',
                    inStockOnly ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-gray-400'
                  )}>
                    {inStockOnly && (
                      <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600">Chỉ hiển thị sản phẩm còn hàng</span>
              </label>
            )}
          </div>

          {/* Clear Filters */}
          <div className="pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="w-full text-gray-500"
            >
              <X size={14} className="mr-2" />
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  function hasActiveFilters() {
    return selectedCategory || priceRange.min || priceRange.max || rating || inStockOnly;
  }
}
