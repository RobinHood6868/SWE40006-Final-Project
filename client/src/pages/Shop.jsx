import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Grid, List, ChevronDown, Search } from 'lucide-react';
import { clsx } from 'clsx';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import ProductModal from '../components/product/ProductModal';
import Skeleton, { SkeletonCard } from '../components/common/Skeleton';
import { useCartStore } from '../stores/cartStore';
import { useDebounce } from '../hooks/useDebounce';

const API = '/api';

export default function ShopPage({ onNavigate, initialSearch = '' }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [rating, setRating] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [localSearchQuery, setLocalSearchQuery] = useState(initialSearch);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { addItem } = useCartStore();

  // Reset local search when initialSearch changes (from header search)
  useEffect(() => {
    if (initialSearch !== searchQuery) {
      setSearchQuery(initialSearch);
      setLocalSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  // Fetch products when filters change
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (priceRange.min) params.set('min_price', priceRange.min);
        if (priceRange.max) params.set('max_price', priceRange.max);
        if (rating) params.set('rating', rating);
        if (inStockOnly) params.set('in_stock', 'true');
        if (sortBy && sortBy !== 'default') params.set('sort', sortBy);

        const response = await fetch(`${API}/products?${params}`);
        const data = await response.json();
        setProducts(data || []);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, debouncedSearch, priceRange, rating, inStockOnly, sortBy, searchQuery]);

  // Load categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`${API}/categories`);
        const data = await response.json();
        setCategories(data || []);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Products are already sorted and filtered by the backend
  const filteredProducts = products;

  const handleClearFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: null, max: null });
    setRating(null);
    setInStockOnly(false);
    setSortBy('default');
  };

  const handleAddToCart = (product) => {
    addItem(product);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tất cả sản phẩm</h1>
              <p className="text-gray-600 mt-1">
                {loading ? 'Đang tải...' : `${filteredProducts.length} sản phẩm`}
                {searchQuery && <span className="text-blue-600 font-medium"> cho "{searchQuery}"</span>}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(localSearchQuery)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full h-11 pl-10 pr-10 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              {localSearchQuery ? (
                <button
                  onClick={() => {
                    setLocalSearchQuery('');
                    setSearchQuery('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => setSearchQuery(localSearchQuery)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1 w-fit">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'p-2 rounded transition-colors',
                viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'p-2 rounded transition-colors',
                viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <List size={18} />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none h-10 pl-4 pr-10 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="best-selling">Bán chạy nhất</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
          >
            <SlidersHorizontal size={16} />
            Lọc
          </button>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={clsx(
            'w-64 flex-shrink-0',
            showFilters ? 'block' : 'hidden lg:block'
          )}>
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              rating={rating}
              onRatingChange={setRating}
              inStockOnly={inStockOnly}
              onInStockChange={setInStockOnly}
              sortBy={sortBy}
              onSortChange={setSortBy}
              isOpen={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
              onClear={handleClearFilters}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className={clsx(
                viewMode === 'grid' 
                  ? 'grid grid-cols-2 md:grid-cols-3 gap-4' 
                  : 'space-y-4'
              )}>
                {Array(6).fill(0).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-600 mb-4">Thử xóa bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className={clsx(
                viewMode === 'grid' 
                  ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4' 
                  : 'space-y-4'
              )}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant={viewMode === 'list' ? 'list' : 'default'}
                    onViewProduct={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
