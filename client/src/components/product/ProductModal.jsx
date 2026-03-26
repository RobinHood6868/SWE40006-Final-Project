import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Star, Check, Smartphone, Cpu, Camera, Battery, Wifi, Bluetooth, HardDrive, Monitor, Weight } from 'lucide-react';
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

// Detailed specifications by category
const getSpecifications = (product) => {
  const specs = [];
  
  // Common specs for all products
  specs.push({
    category: 'Thông tin chung',
    items: [
      { label: 'Danh mục', value: product.category_name || 'N/A' },
      { label: 'Thương hiệu', value: product.name?.split(' ')[0] || 'N/A' },
      { label: 'Tình trạng', value: 'Mới 100%', icon: Check },
      { label: 'Bảo hành', value: '12 tháng', icon: Shield },
    ]
  });

  // Phone/Tablet specs
  if (product.category_name?.toLowerCase().includes('điện thoại') || 
      product.category_name?.toLowerCase().includes('máy tính bảng')) {
    specs.push({
      category: 'Màn hình & Hiệu năng',
      items: [
        { label: 'Màn hình', value: product.name.includes('Pro') || product.name.includes('Ultra') ? '6.8" OLED, 120Hz' : '6.7" OLED, 120Hz', icon: Monitor },
        { label: 'Chip xử lý', value: product.name.includes('iPhone') ? 'Apple A17 Pro' : 'Snapdragon 8 Gen 3', icon: Cpu },
        { label: 'RAM', value: product.name.includes('Ultra') || product.name.includes('Pro') ? '12GB' : '8GB', icon: HardDrive },
        { label: 'Bộ nhớ', value: '256GB', icon: HardDrive },
      ]
    });
    specs.push({
      category: 'Camera & Pin',
      items: [
        { label: 'Camera sau', value: product.name.includes('Ultra') ? '200MP + 50MP + 12MP' : '48MP + 12MP + 12MP', icon: Camera },
        { label: 'Camera trước', value: '12MP', icon: Camera },
        { label: 'Pin', value: product.name.includes('Plus') || product.name.includes('Ultra') ? '5000mAh' : '4400mAh', icon: Battery },
        { label: 'Sạc nhanh', value: '45W', icon: Battery },
      ]
    });
  }

  // Laptop specs
  if (product.category_name?.toLowerCase().includes('laptop')) {
    specs.push({
      category: 'Màn hình & Hiệu năng',
      items: [
        { label: 'Màn hình', value: product.name.includes('MacBook') ? '14.2" Liquid Retina XDR' : '15.6" OLED 3.5K', icon: Monitor },
        { label: 'Chip xử lý', value: product.name.includes('M3') ? 'Apple M3 Pro' : 'Intel Core i9-13900H', icon: Cpu },
        { label: 'RAM', value: product.name.includes('MacBook') ? '18GB Unified' : '32GB DDR5', icon: HardDrive },
        { label: 'SSD', value: '512GB NVMe', icon: HardDrive },
        { label: 'GPU', value: product.name.includes('MacBook') ? '18-core GPU' : 'NVIDIA RTX 4060 8GB', icon: Cpu },
      ]
    });
    specs.push({
      category: 'Kết nối & Pin',
      items: [
        { label: 'Pin', value: '72Wh, lên đến 22 giờ', icon: Battery },
        { label: 'Kết nối không dây', value: 'Wi-Fi 6E, Bluetooth 5.3', icon: Wifi },
        { label: 'Cổng kết nối', value: '3x Thunderbolt 4, HDMI, SD Card', icon: Check },
        { label: 'Cân nặng', value: product.name.includes('MacBook') ? '1.61 kg' : '1.8 kg', icon: Weight },
      ]
    });
  }

  // Headphones specs
  if (product.category_name?.toLowerCase().includes('tai nghe')) {
    specs.push({
      category: 'Âm thanh & Kết nối',
      items: [
        { label: 'Loại tai nghe', value: product.name.includes('AirPods') ? 'True Wireless' : 'Over-ear', icon: Check },
        { label: 'Chống ồn', value: 'ANC chủ động', icon: Check },
        { label: 'Driver', value: product.name.includes('AirPods') ? '11mm' : '40mm', icon: Check },
        { label: 'Kết nối', value: 'Bluetooth 5.3', icon: Bluetooth },
        { label: 'Thời lượng pin', value: product.name.includes('Sony') ? '30 giờ' : '6 giờ (ANC on)', icon: Battery },
      ]
    });
  }

  // Smartwatch specs
  if (product.category_name?.toLowerCase().includes('đồng hồ')) {
    specs.push({
      category: 'Màn hình & Tính năng',
      items: [
        { label: 'Màn hình', value: '1.5" AMOLED, Always-on', icon: Monitor },
        { label: 'Kích thước', value: '45mm', icon: Check },
        { label: 'Chất liệu', value: 'Nhôm/Thép không gỉ', icon: Check },
        { label: 'Chống nước', value: '5ATM + IP68', icon: Check },
        { label: 'Pin', value: 'Lên đến 36 giờ', icon: Battery },
      ]
    });
    specs.push({
      category: 'Cảm biến & Sức khỏe',
      items: [
        { label: 'Cảm biến', value: 'Nhịp tim, SpO2, GPS', icon: Check },
        { label: 'Theo dõi', value: 'Giấc ngủ, Calorie, Stress', icon: Check },
        { label: 'Chế độ thể thao', value: '100+ chế độ', icon: Check },
      ]
    });
  }

  // Gaming specs
  if (product.category_name?.toLowerCase().includes('gaming')) {
    specs.push({
      category: 'Hiệu năng & Đồ họa',
      items: [
        { label: 'CPU', value: product.name.includes('PlayStation') ? 'AMD Zen 2, 8 cores' : 'AMD Zen 2, 8 cores', icon: Cpu },
        { label: 'GPU', value: '10.28 TFLOPS, RDNA 2', icon: Cpu },
        { label: 'RAM', value: '16GB GDDR6', icon: HardDrive },
        { label: 'SSD', value: product.name.includes('Xbox') ? '1TB NVMe' : '1TB Custom SSD', icon: HardDrive },
        { label: 'Output', value: '4K @ 120Hz, 8K @ 60Hz', icon: Monitor },
      ]
    });
  }

  // Camera specs
  if (product.category_name?.toLowerCase().includes('máy ảnh')) {
    specs.push({
      category: 'Cảm biến & Ống kính',
      items: [
        { label: 'Cảm biến', value: product.name.includes('Sony') ? '33MP Full-Frame' : '24MP Full-Frame', icon: Camera },
        { label: 'ISO', value: '100-51200 (mở rộng 50-204800)', icon: Check },
        { label: 'Quay video', value: '4K 60fps, 10-bit 4:2:2', icon: Camera },
        { label: 'Lấy nét', value: '759 điểm AF, Eye AF', icon: Check },
      ]
    });
    specs.push({
      category: 'Màn hình & Kết nối',
      items: [
        { label: 'Màn hình', value: '3.0" LCD cảm ứng, xoay lật', icon: Monitor },
        { label: 'Kính ngắm', value: 'OLED, 3.69M dots', icon: Check },
        { label: 'Kết nối', value: 'Wi-Fi, Bluetooth, USB-C', icon: Wifi },
        { label: 'Thẻ nhớ', value: 'Dual SD (UHS-II)', icon: HardDrive },
      ]
    });
  }

  return specs;
};

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
  const specifications = getSpecifications(product);

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
      <div className="relative bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp">
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
                    onClick={() => setActiveTab('specs')}
                    className={clsx(
                      'pb-3 text-sm font-medium transition-colors relative',
                      activeTab === 'specs' 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    Thông số
                    {activeTab === 'specs' && (
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
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {product.description || 'Sản phẩm chính hãng, bảo hành 12 tháng. Giao hàng toàn quốc. Đổi trả trong 30 ngày nếu có lỗi từ nhà sản xuất.'}
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-blue-900 mb-2">🎁 Ưu đãi đặc biệt:</h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Miễn phí vận chuyển toàn quốc</li>
                        <li>• Tặng kèm phụ kiện trị giá đến 500.000đ</li>
                        <li>• Trả góp 0% qua thẻ tín dụng</li>
                        <li>• Thu cũ đổi mới, trợ giá đến 2 triệu</li>
                      </ul>
                    </div>
                  </div>
                ) : activeTab === 'specs' ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {specifications.map((specGroup, idx) => (
                      <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                          <h4 className="text-sm font-bold text-gray-900">{specGroup.category}</h4>
                        </div>
                        <div className="divide-y divide-gray-50">
                          {specGroup.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50">
                              {item.icon && <item.icon size={14} className="text-gray-400 flex-shrink-0" />}
                              <span className="text-xs text-gray-600 w-32 flex-shrink-0">{item.label}</span>
                              <span className="text-xs font-medium text-gray-900">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
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
