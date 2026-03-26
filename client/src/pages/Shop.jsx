import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Grid, List, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import ProductModal from '../components/product/ProductModal';
import Skeleton, { SkeletonCard } from '../components/common/Skeleton';
import { useCartStore } from '../stores/cartStore';
import { useDebounce } from '../hooks/useDebounce';

const API = '/api';

export default function ShopPage({ onNavigate }) {
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
  const [searchQuery, setSearchQuery] = useState('');
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { addItem } = useCartStore();

  // Fetch products when filters change
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (debouncedSearch) params.set('search', debouncedSearch);
        
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
  }, [selectedCategory, debouncedSearch]);

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

  // Sort products (client-side)
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'newest': return new Date(b.created_at) - new Date(a.created_at);
      default: return 0;
    }
  });

  // Apply client-side filters (price, rating, stock)
  const filteredProducts = sortedProducts.filter(p => {
    if (priceRange.min && p.price < priceRange.min) return false;
    if (priceRange.max && p.price > priceRange.max) return false;
    if (rating && (p.rating || 0) < rating) return false;
    if (inStockOnly && (p.stock || 0) === 0) return false;
    return true;
  });

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tất cả sản phẩm</h1>
            <p className="text-gray-600 mt-1">
              {loading ? 'Đang tải...' : `${filteredProducts.length} sản phẩm`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
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
