import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, calculateDiscount } from '../../utils/formatters';
import { useCountdown, getFlashSaleEndTime } from '../../hooks/useCountdown';
import ProductImage from '../product/ProductImage';

const API = '/api';

export default function FlashSales({ onViewProduct, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const endTime = getFlashSaleEndTime();
  const { hours, minutes, seconds, isExpired } = useCountdown(endTime);

  // Fetch flash sale products (featured products with discount)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API}/products`);
        const allProducts = await response.json();
        
        // Filter products with good discounts and featured
        const flashProducts = allProducts
          .filter(p => {
            const discount = calculateDiscount(p.original_price, p.price);
            return discount >= 10 || p.is_featured;
          })
          .slice(0, 8) // Limit to 8 products
          .map(p => ({
            ...p,
            discount: calculateDiscount(p.original_price, p.price),
            sold: Math.floor(Math.random() * 200) + 50
          }));
        
        setProducts(flashProducts);
      } catch (error) {
        console.error('Error fetching flash sale products:', error);
      }
    };
    
    fetchProducts();
  }, []);

  // Auto-play carousel - slide automatically every 2 seconds
  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        const maxIndex = Math.max(0, products.length - 4);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, products.length]);

  const nextSlide = () => {
    setCurrentIndex(prev => {
      const maxIndex = Math.max(0, products.length - 4);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex(prev => {
      const maxIndex = Math.max(0, products.length - 4);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  if (isExpired || products.length === 0) {
    return (
      <section className="py-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-y border-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">Flash sale đã kết thúc. Đừng bỏ lỡ sale tiếp theo!</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-8 bg-gradient-to-r from-red-50 to-orange-50 border-y border-red-100 overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
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
          <div className="hidden md:flex items-center gap-2">
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

        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-colors -ml-2"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-colors -mr-2"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>

          {/* Products Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (272 + 16)}px)` }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-64 md:w-72 bg-white rounded-xl border border-red-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onViewProduct?.(product)}
                >
                  {/* Image */}
                  <div className="relative bg-red-50 aspect-square overflow-hidden">
                    <ProductImage
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                        -{product.discount}%
                      </span>
                    )}
                    
                    {/* Stock Warning */}
                    {product.stock <= 10 && (
                      <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                        Còn {product.stock}
                      </span>
                    )}
                    
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                      <div 
                        className="h-full bg-red-600 transition-all duration-500"
                        style={{ width: `${Math.min(100, (product.sold / (product.sold + (product.stock || 50))) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <span className="text-xs text-gray-500 uppercase">{product.category_name}</span>
                    <h3 className="text-sm font-medium text-gray-900 mt-1 line-clamp-2 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-yellow-500">★</span>
                        <span className="text-xs font-medium">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.review_count})</span>
                      </div>
                    )}
                    
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold text-red-600 font-mono">
                        {formatCurrency(product.price)}
                      </span>
                      {product.original_price > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatCurrency(product.original_price)}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Đã bán: <span className="font-semibold text-red-600">{product.sold}</span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart?.(product);
                      }}
                      className="w-full mt-3 h-9 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Thêm vào giỏ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.max(1, products.length - 3) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-8 bg-red-600'
                    : 'w-2 bg-red-200 hover:bg-red-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile - No view all link */}
      </div>
    </section>
  );
}
