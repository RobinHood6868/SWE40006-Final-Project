import React from 'react';
import { Heart, ShoppingCart, Eye, Scale } from 'lucide-react';
import { clsx } from 'clsx';
import { formatCurrency, calculateDiscount } from '../../utils/formatters';
import { Rating } from '../common/Rating';
import ProductImage from './ProductImage';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useComparisonStore } from '../../stores/comparisonStore';

export default function ProductCard({ product, variant = 'default', onViewProduct, onAddToCart }) {
  const wishlist = useWishlistStore();
  const comparison = useComparisonStore();
  const isInWishlist = wishlist.isInWishlist(product.id);
  const isInComparison = comparison.isInComparison(product.id);
  const canAddToComparison = comparison.canAdd();
  
  const discount = calculateDiscount(product.original_price, product.price);
  const isFlash = variant === 'flash';
  const stockRemaining = product.stock || Math.floor(Math.random() * 50);
  const sold = product.sold || Math.floor(Math.random() * 500);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    wishlist.toggleItem(product);
  };

  const handleComparisonToggle = (e) => {
    e.stopPropagation();
    comparison.toggleProduct(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  return (
    <article
      onClick={() => onViewProduct?.(product)}
      className={clsx(
        'group bg-white rounded-xl border overflow-hidden cursor-pointer transition-all duration-300',
        isFlash ? 'border-red-200 hover:border-red-300 hover:shadow-red-100' : 'border-gray-100 hover:border-gray-200 hover:shadow-lg'
      )}
    >
      {/* Image Section */}
      <div className={clsx(
        'relative overflow-hidden',
        isFlash ? 'bg-red-50' : 'bg-gray-50'
      )}>
        <ProductImage
          src={product.image_url}
          alt={product.name}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className={clsx(
              "px-2 py-1 rounded text-xs font-bold",
              isFlash ? "bg-red-600 text-white" : "bg-black text-white"
            )}>
              -{discount}%
            </span>
          )}
          {product.rating >= 4.5 && (
            <span className="px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">
              ★ Yêu thích
            </span>
          )}
        </div>

        {/* Stock Warning for Flash Sale */}
        {isFlash && stockRemaining <= 10 && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
            Còn {stockRemaining}
          </div>
        )}

        {/* Quick Actions (on hover) */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2">
            <button
              onClick={handleWishlistToggle}
              className={clsx(
                "flex-1 h-9 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors",
                isInWishlist
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-500"
              )}
            >
              <Heart size={16} className={isInWishlist ? "fill-white" : ""} />
              {isInWishlist ? 'Đã thích' : 'Yêu thích'}
            </button>
            <button
              onClick={handleComparisonToggle}
              className={clsx(
                "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors",
                isInComparison
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              )}
              title={isInComparison ? 'Bỏ so sánh' : 'So sánh'}
              disabled={!canAddToComparison && !isInComparison}
            >
              <Scale size={16} />
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 h-9 bg-black text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart size={16} />
              Thêm
            </button>
          </div>
        </div>

        {/* Flash Sale Progress */}
        {isFlash && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
            <div 
              className="h-full bg-red-600 transition-all duration-500"
              style={{ width: `${Math.min(100, (sold / (sold + stockRemaining)) * 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3">
        {/* Category */}
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          {product.category_name}
        </span>

        {/* Name */}
        <h3 className="text-sm font-medium text-gray-900 mt-1 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="mt-2">
            <Rating value={product.rating} count={product.review_count} size="sm" />
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className={clsx(
            "text-base font-bold font-mono",
            isFlash ? "text-red-600" : "text-gray-900"
          )}>
            {formatCurrency(product.price)}
          </span>
          {product.original_price > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(product.original_price)}
            </span>
          )}
        </div>

        {/* Flash Sale Info */}
        {isFlash && (
          <div className="mt-2 text-xs text-gray-500">
            Đã bán: <span className="font-semibold text-red-600">{sold}</span>
          </div>
        )}

        {/* Free Shipping Badge */}
        {product.price >= 500000 && (
          <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
            <span>🚚</span>
            <span className="font-medium">Miễn phí vận chuyển</span>
          </div>
        )}
      </div>
    </article>
  );
}
