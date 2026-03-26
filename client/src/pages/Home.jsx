import React from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
import FlashSales from '../components/home/FlashSales';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductCarousel from '../components/home/ProductCarousel';
import ProductCard from '../components/product/ProductCard';
import { formatCurrency } from '../utils/formatters';

export default function HomePage({ products, categories, onViewProduct, onAddToCart }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Flash Sales */}
      <FlashSales />

      {/* Categories */}
      <CategoryGrid />

      {/* Best Sellers Carousel */}
      <ProductCarousel 
        title="🔥 Sản phẩm bán chạy"
        onViewProduct={onViewProduct}
      />

      {/* New Arrivals */}
      <ProductCarousel 
        title="✨ Sản phẩm mới nhất"
        onViewProduct={onViewProduct}
      />

      {/* Promotional Banner */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-64 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                <span className="text-sm font-medium opacity-80 mb-2">Ưu đãi đặc biệt</span>
                <h3 className="text-3xl font-bold mb-4">MacBook Pro M3</h3>
                <p className="text-lg opacity-90 mb-6">Giảm đến 15% khi mua kèm iPad</p>
                <button className="self-start px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  Xem ngay
                </button>
              </div>
              <div className="absolute right-0 bottom-0 w-64 h-full opacity-20">
                <img 
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400" 
                  alt="MacBook"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="relative h-64 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                <span className="text-sm font-medium opacity-80 mb-2">Tai nghe cao cấp</span>
                <h3 className="text-3xl font-bold mb-4">AirPods Pro 2</h3>
                <p className="text-lg opacity-90 mb-6">Chip H2, chống ồn chủ động</p>
                <button className="self-start px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  Mua ngay
                </button>
              </div>
              <div className="absolute right-0 bottom-0 w-48 h-full opacity-20">
                <img 
                  src="https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400" 
                  alt="AirPods"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Products Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tất cả sản phẩm</h2>
            <p className="text-gray-600">Khám phá bộ sưu tập công nghệ đa dạng của chúng tôi</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.slice(0, 10).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={onViewProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <a 
              href="/shop" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Xem thêm sản phẩm
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tại sao chọn Volta?</h2>
            <p className="text-gray-600">Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-xl border border-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">100% Chính hãng</h3>
              <p className="text-sm text-gray-600">Tất cả sản phẩm đều có nguồn gốc rõ ràng, đầy đủ giấy tờ</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Giao hàng nhanh</h3>
              <p className="text-sm text-gray-600">Nhận hàng trong 24h tại nội thành, 2-3 ngày toàn quốc</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-50 rounded-full flex items-center justify-center">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Bảo hành 12-24 tháng</h3>
              <p className="text-sm text-gray-600">Bảo hành chính hãng tại các trung tâm trên toàn quốc</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-50 rounded-full flex items-center justify-center">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Hỗ trợ 24/7</h3>
              <p className="text-sm text-gray-600">Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn mọi lúc</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
