import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import ProductImage from '../product/ProductImage';

export default function ProductCarousel({ title = 'Sản phẩm bán chạy', products = [], onViewProduct }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Mock data if no products provided
  const displayProducts = products.length > 0 ? products : [
    { id: 1, name: 'iPhone 15 Pro', price: 29990000, original_price: 34990000, image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', rating: 4.9, review_count: 234, sold: 1250 },
    { id: 2, name: 'MacBook Air M2', price: 27990000, original_price: 31990000, image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', rating: 4.8, review_count: 189, sold: 890 },
    { id: 3, name: 'Samsung S24 Ultra', price: 31990000, original_price: 35990000, image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', rating: 4.7, review_count: 156, sold: 756 },
    { id: 4, name: 'AirPods Pro 2', price: 5490000, original_price: 6990000, image_url: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400', rating: 4.8, review_count: 234, sold: 2100 },
    { id: 5, name: 'iPad Pro M2', price: 24990000, original_price: 28990000, image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', rating: 4.9, review_count: 178, sold: 567 },
    { id: 6, name: 'Apple Watch Ultra', price: 19990000, original_price: 22990000, image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', rating: 4.8, review_count: 145, sold: 432 },
  ];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp size={20} className="text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500">Sản phẩm được mua nhiều nhất hôm nay</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-lg border transition-colors ${
                canScrollLeft 
                  ? 'border-gray-200 hover:bg-gray-50 text-gray-700' 
                  : 'border-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-lg border transition-colors ${
                canScrollRight 
                  ? 'border-gray-200 hover:bg-gray-50 text-gray-700' 
                  : 'border-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Products Scroll */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onViewProduct?.(product)}
              className="flex-shrink-0 w-56 bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
            >
              <div className="aspect-square bg-gray-50 relative overflow-hidden">
                <ProductImage 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.original_price > product.price && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -{Math.round((1 - product.price / product.original_price) * 100)}%
                  </span>
                )}
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-600">
                  Đã bán {product.sold}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 truncate mb-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.review_count})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-red-600">
                    {formatCurrency(product.price)}
                  </span>
                  {product.original_price > product.price && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatCurrency(product.original_price)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
