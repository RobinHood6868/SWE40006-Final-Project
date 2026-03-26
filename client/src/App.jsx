import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import OrderTracking from './pages/OrderTracking';
import CartDrawer from './components/cart/CartDrawer';
import ProductModal from './components/product/ProductModal';
import WishlistDrawer from './components/product/WishlistDrawer';
import ProductComparison from './components/product/ProductComparison';
import Toast from './components/common/Toast';
import { useCartStore } from './stores/cartStore';
import { useRecentlyViewedStore } from './stores/recentlyViewedStore';
import { useComparisonStore } from './stores/comparisonStore';
import { Scale, X } from 'lucide-react';

const API = '/api';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'shop' | 'track'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const { addItem: addToCart } = useCartStore();
  const recentlyViewed = useRecentlyViewedStore();
  const comparison = useComparisonStore();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          fetch(`${API}/categories`),
          fetch(`${API}/products`)
        ]);
        const cats = await catsRes.json();
        const prods = await prodsRes.json();
        setCategories(cats || []);
        setProducts(prods || []);
      } catch (error) {
        showToast('Không thể tải dữ liệu', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    recentlyViewed.addProduct(product);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast(`Đã thêm ${product.name} vào giỏ hàng`, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onCartClick={() => setShowCart(true)}
        onNavigate={handleNavigate}
        currentView={currentView}
      />
      
      <main className="pt-20 sm:pt-24">
        {currentView === 'home' && (
          <Home 
            products={products}
            categories={categories}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
          />
        )}
        
        {currentView === 'shop' && (
          <Shop 
            onNavigate={handleNavigate}
          />
        )}
        
        {currentView === 'track' && (
          <OrderTracking 
            onNavigate={handleNavigate}
          />
        )}
      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onViewProduct={handleViewProduct}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
        onViewProduct={handleViewProduct}
      />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Product Comparison Modal */}
      <ProductComparison
        products={comparison.items}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        onRemove={comparison.removeProduct}
      />

      {/* Comparison Floating Bar */}
      {comparison.items.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 animate-slideUp">
          <div className="bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Scale size={18} className="text-blue-400" />
              <span className="text-sm font-medium">
                {comparison.items.length} sản phẩm so sánh
              </span>
            </div>
            <div className="flex -space-x-2">
              {comparison.items.map((p) => (
                <img
                  key={p.id}
                  src={p.image_url}
                  alt={p.name}
                  className="w-8 h-8 rounded-full border-2 border-black object-cover"
                />
              ))}
            </div>
            <button
              onClick={() => setShowComparison(true)}
              className="px-4 py-1.5 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              Xem
            </button>
            <button
              onClick={() => setShowComparison(true)}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-colors"
            >
              So sánh
            </button>
            <button
              onClick={comparison.clearComparison}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all z-40 animate-bounce"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}
