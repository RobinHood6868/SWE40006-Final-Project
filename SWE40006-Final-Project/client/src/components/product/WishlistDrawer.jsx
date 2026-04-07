import React from 'react';
import { Heart } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useCartStore } from '../../stores/cartStore';
import ProductImage from './ProductImage';

export default function WishlistDrawer({ isOpen, onClose, onViewProduct }) {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-slideLeft">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Heart size={20} className="text-red-600 fill-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Danh sách yêu thích</h2>
              <p className="text-xs text-gray-500">{items.length} sản phẩm</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-xs text-gray-500 hover:text-red-600 transition-colors"
              >
                Xóa tất cả
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                <Heart size={32} className="text-red-300" />
              </div>
              <p className="text-gray-600 font-medium mb-2">Chưa có sản phẩm nào</p>
              <p className="text-sm text-gray-500">
                Nhấn vào icon trái tim để thêm sản phẩm vào danh sách yêu thích
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div 
                    className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      onViewProduct?.(product);
                      onClose();
                    }}
                  >
                    <ProductImage
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 
                      className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => {
                        onViewProduct?.(product);
                        onClose();
                      }}
                    >
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{product.category_name}</p>
                    <div className="text-base font-bold text-red-600 mt-2 font-mono">
                      {formatCurrency(product.price)}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => {
                          addToCart(product);
                          removeItem(product.id);
                        }}
                        className="flex-1"
                      >
                        Thêm vào giỏ
                      </Button>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
