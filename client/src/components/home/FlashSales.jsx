import React from 'react';
import { Clock, Zap, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCountdown, getFlashSaleEndTime } from '../../hooks/useCountdown';
import ProductCard from '../product/ProductCard';

// Mock flash sale products
const flashSaleProducts = [
  {
    id: 101,
    name: 'AirPods Pro 2',
    price: 5490000,
    original_price: 6990000,
    image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80',
    category_name: 'Tai nghe',
    rating: 4.8,
    review_count: 234,
    stock: 15,
    sold: 185
  },
  {
    id: 102,
    name: 'Apple Watch Series 9',
    price: 9990000,
    original_price: 12990000,
    image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80',
    category_name: 'Đồng hồ thông minh',
    rating: 4.9,
    review_count: 189,
    stock: 8,
    sold: 92
  },
  {
    id: 103,
    name: 'iPad Air 5 M1',
    price: 14990000,
    original_price: 18990000,
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
    category_name: 'Máy tính bảng',
    rating: 4.7,
    review_count: 156,
    stock: 12,
    sold: 78
  },
  {
    id: 104,
    name: 'Sony WH-1000XM5',
    price: 7990000,
    original_price: 9990000,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    category_name: 'Tai nghe',
    rating: 4.9,
    review_count: 312,
    stock: 5,
    sold: 167
  }
];

export default function FlashSales({ onViewProduct, onAddToCart }) {
  const endTime = getFlashSaleEndTime();
  const { hours, minutes, seconds, isExpired } = useCountdown(endTime);

  if (isExpired) {
    return (
      <section className="py-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-y border-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">Flash sale đã kết thúc. Đừng bỏ lỡ sale tiếp theo!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-gradient-to-r from-red-50 to-orange-50 border-y border-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600 rounded-xl">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">⚡ Flash Sale</h2>
              <p className="text-sm text-gray-600">Kết thúc trong:</p>
            </div>
          </div>
          
          {/* Countdown Timer */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 text-white px-4 py-3 rounded-lg text-center min-w-[60px]">
                <div className="text-2xl font-bold font-mono">{String(hours).padStart(2, '0')}</div>
                <div className="text-xs opacity-80">Giờ</div>
              </div>
              <span className="text-2xl font-bold text-red-600">:</span>
              <div className="bg-red-600 text-white px-4 py-3 rounded-lg text-center min-w-[60px]">
                <div className="text-2xl font-bold font-mono">{String(minutes).padStart(2, '0')}</div>
                <div className="text-xs opacity-80">Phút</div>
              </div>
              <span className="text-2xl font-bold text-red-600">:</span>
              <div className="bg-red-600 text-white px-4 py-3 rounded-lg text-center min-w-[60px]">
                <div className="text-2xl font-bold font-mono animate-pulse">{String(seconds).padStart(2, '0')}</div>
                <div className="text-xs opacity-80">Giây</div>
              </div>
            </div>
          </div>

          <a href="/shop" className="hidden md:flex items-center gap-2 text-red-600 font-medium hover:underline">
            Xem tất cả <TrendingUp size={16} />
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {flashSaleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="flash"
              onViewProduct={onViewProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="md:hidden mt-6 text-center">
          <a href="/shop" className="inline-flex items-center gap-2 text-red-600 font-medium">
            Xem tất cả sản phẩm flash sale <TrendingUp size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
