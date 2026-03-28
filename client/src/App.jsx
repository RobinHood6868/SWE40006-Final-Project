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
import Toast from './components/common/Toast';
import { useCartStore } from './stores/cartStore';
import { useRecentlyViewedStore } from './stores/recentlyViewedStore';

const API = '/api';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'shop' | 'track'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // UI State
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const { addItem: addToCart } = useCartStore();
  const recentlyViewed = useRecentlyViewedStore();

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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCartClick={() => setShowCart(true)}
        onNavigate={handleNavigate}
        currentView={currentView}
        onSearch={handleSearch}
      />
      
      <main className="pt-20 sm:pt-24">
        {currentView === 'home' && (
          <Home
            products={products}
            categories={categories}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
          />
        )}
        
        {currentView === 'shop' && (
          <Shop
            onNavigate={handleNavigate}
            initialSearch={searchQuery}
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
