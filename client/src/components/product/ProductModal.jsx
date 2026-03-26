import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { formatCurrency, calculateDiscount } from '../../utils/formatters';
import { Rating, RatingBreakdown } from '../common/Rating';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import ProductImage from './ProductImage';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useRecentlyViewedStore } from '../../stores/recentlyViewedStore';

// Mock reviews data
const mockReviews = [
  { id: 1, user: 'Nguyễn V***h', rating: 5, date: '2024-01-15', content: 'Sản phẩm rất tốt, giao hàng nhanh. Đóng gói cẩn thận.', verified: true, helpful: 23, images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100'] },
  { id: 2, user: 'Trần M***i', rating: 5, date: '2024-01-10', content: 'Chất lượng tuyệt vời, đúng như mô tả. Sẽ ủng hộ thêm.', verified: true, helpful: 18, images: [] },
  { id: 3, user: 'Lê H***g', rating: 4, date: '2024-01-05', content: 'Sản phẩm tốt nhưng giao hơi lâu. Nhìn chung hài lòng.', verified: true, helpful: 12, images: [] },
];

const mockRatings = [
  { stars: 5, count: 156 },
  { stars: 4, count: 45 },
  { stars: 3, count: 12 },
  { stars: 2, count: 3 },
  { stars: 1, count: 2 },
];

export default function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewFilter, setReviewFilter] = useState(null);
  
  const wishlist = useWishlistStore();
  const recentlyViewed = useRecentlyViewedStore();
  
  const isInWishlist = wishlist.isInWishlist(product?.id);

  useEffect(() => {
    if (product) {
      recentlyViewed.addProduct(product);
      setQuantity(1);
      setSelectedImage(0);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const discount = calculateDiscount(product.original_price, product.price);
  const stockRemaining = product.stock || Math.floor(Math.random() * 50);

  const handleAddToCart = () => {
    onAddToCart({ ...product, qty: quantity });
    onClose();
  };

  const handleWishlistToggle = () => {
    wishlist.toggleItem(product);
  };

  const images = [
    product.image_url,
    'https://images.unsplash.com/photo-1560393464-5c69a71c57a3?w=400',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm hover:bg-gray-100 rounded-full transition-colors shadow-lg"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Images */}
            <div className="p-6 bg-gray-50">
              <div className="aspect-square bg-white rounded-xl overflow-hidden border border-gray-100 mb-4">
                <ProductImage
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full"
                  zoomOnHover={true}
                />
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={clsx(
                        'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                        selectedImage === idx ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="p-6">
              {/* Category & Badges */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-500 uppercase tracking-wide">{product.category_name}</span>
                {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
                {product.rating >= 4.5 && <Badge variant="success">★ Yêu thích</Badge>}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h2>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <Rating value={product.rating} count={product.review_count} size="md" />
                <span className="text-sm text-gray-500">|</span>
                <span className="text-sm text-green-600 font-medium">{stockRemaining > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
                {stockRemaining <= 10 && stockRemaining > 0 && (
                  <span className="text-xs text-orange-600 font-medium">({stockRemaining} sản phẩm)</span>
                )}
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-red-600 font-mono">
                    {formatCurrency(product.price)}
                  </span>
                  {product.original_price > product.price && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatCurrency(product.original_price)}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-xs text-green-600 mt-2">
                    🔥 Bạn tiết kiệm được {formatCurrency(product.original_price - product.price)}
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Số lượng
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 text-center border border-gray-200 rounded-lg font-medium"
                    min="1"
                    max={stockRemaining}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(stockRemaining, quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                  <span className="text-sm text-gray-500 ml-2">
                    Tối đa: {stockRemaining} sản phẩm
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 bg-black hover:bg-gray-800"
                  disabled={stockRemaining === 0}
                >
                  <ShoppingCart size={18} />
                  {stockRemaining > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                </Button>
                <Button
                  onClick={handleWishlistToggle}
                  variant="outline"
                  size="lg"
                  className={clsx(
                    isInWishlist && 'border-red-500 text-red-500 bg-red-50'
                  )}
                >
                  <Heart size={18} className={isInWishlist ? 'fill-red-500' : ''} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 size={18} />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Shield size={20} className="mx-auto mb-1 text-blue-600" />
                  <p className="text-xs font-medium text-gray-700">Chính hãng</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Truck size={20} className="mx-auto mb-1 text-blue-600" />
                  <p className="text-xs font-medium text-gray-700">Giao nhanh</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <RotateCcw size={20} className="mx-auto mb-1 text-blue-600" />
                  <p className="text-xs font-medium text-gray-700">Đổi trả</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex gap-4 mb-4 border-b border-gray-100">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={clsx(
                      'pb-3 text-sm font-medium transition-colors relative',
                      activeTab === 'description' 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    Mô tả
                    {activeTab === 'description' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={clsx(
                      'pb-3 text-sm font-medium transition-colors relative',
                      activeTab === 'reviews' 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    Đánh giá ({product.review_count || 218})
                    {activeTab === 'reviews' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'description' ? (
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {product.description || 'Sản phẩm chính hãng, bảo hành 12 tháng. Giao hàng toàn quốc. Đổi trả trong 30 ngày nếu có lỗi từ nhà sản xuất.'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Rating Summary */}
                    <div className="flex items-start gap-6 pb-4 border-b border-gray-100">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">{product.rating || 4.5}</div>
                        <Rating value={product.rating || 4.5} size="lg" />
                        <div className="text-xs text-gray-500 mt-1">{product.review_count || 218} đánh giá</div>
                      </div>
                      <div className="flex-1">
                        <RatingBreakdown ratings={mockRatings} onFilter={setReviewFilter} />
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {mockReviews
                        .filter(r => !reviewFilter || r.rating >= reviewFilter)
                        .map(review => (
                        <div key={review.id} className="pb-4 border-b border-gray-50 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{review.user}</span>
                              {review.verified && (
                                <span className="text-xs text-green-600 flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Đã mua
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-400">{review.date}</span>
                          </div>
                          <Rating value={review.rating} size="sm" showCount={false} />
                          <p className="text-sm text-gray-600 mt-2">{review.content}</p>
                          {review.images.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {review.images.map((img, idx) => (
                                <img key={idx} src={img} alt="Review" className="w-16 h-16 rounded object-cover" />
                              ))}
                            </div>
                          )}
                          <button className="text-xs text-gray-500 mt-2 hover:text-blue-600">
                            👍 Hữu ích ({review.helpful})
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
