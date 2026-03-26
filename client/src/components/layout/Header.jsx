import React, { useState } from 'react';
import { Search, ShoppingCart, Package, Bell, User, ChevronDown } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import MegaMenu from './MegaMenu';

export default function Header({ onCartClick, onNavigate, currentView }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop');
      // Search logic will be handled by parent
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-xs">
            <div className="flex items-center gap-4 text-gray-600">
              <span className="hover:text-blue-600 cursor-pointer">Về chúng tôi</span>
              <span className="hover:text-blue-600 cursor-pointer">Liên hệ</span>
              <span className="hover:text-blue-600 cursor-pointer">Tuyển dụng</span>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="hover:text-blue-600 cursor-pointer flex items-center gap-1">
                <Bell size={12} /> Thông báo
              </span>
              <span className="hover:text-blue-600 cursor-pointer flex items-center gap-1">
                <User size={12} /> Đăng nhập
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
            onClick={() => onNavigate('home')}
          >
            <div className="text-xl font-bold font-mono tracking-tight">
              Volt<span className="text-blue-600">a</span>
            </div>
          </div>

          {/* Mega Menu Trigger */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onMouseEnter={() => setShowMegaMenu(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-blue-600">☰</span>
              Danh mục
              <ChevronDown size={14} />
            </button>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSubmitSearch} className="flex-1 max-w-2xl hidden sm:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm, danh mục..."
                className="w-full h-10 pl-4 pr-12 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('track')}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'track' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Package size={18} />
              <span className="hidden md:inline">Tra đơn hàng</span>
            </button>

            <button
              onClick={onCartClick}
              className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <span className="hidden md:inline">Giỏ hàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu */}
      {showMegaMenu && (
        <MegaMenu 
          onClose={() => setShowMegaMenu(false)} 
          onNavigate={onNavigate}
        />
      )}

      {/* Mobile Search */}
      <div className="sm:hidden px-4 pb-3">
        <form onSubmit={handleSubmitSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full h-10 pl-4 pr-12 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
          />
          <button 
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-md"
          >
            <Search size={16} />
          </button>
        </form>
      </div>
    </header>
  );
}
