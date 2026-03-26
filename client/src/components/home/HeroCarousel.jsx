import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

const slides = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max',
    subtitle: 'Công nghệ đột phá',
    description: 'Trải nghiệm sức mạnh của chip A17 Pro. Đặt hàng ngay hôm nay!',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
    bg: 'from-gray-900 to-gray-700',
    cta: 'Mua ngay',
    link: '/shop'
  },
  {
    id: 2,
    title: 'MacBook Pro M3',
    subtitle: 'Hiệu năng đỉnh cao',
    description: 'Chip M3 mạnh mẽ chưa từng thấy. Dành cho chuyên gia.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    bg: 'from-blue-900 to-blue-700',
    cta: 'Khám phá',
    link: '/shop'
  },
  {
    id: 3,
    title: 'Samsung Galaxy S24 Ultra',
    subtitle: 'AI đột phá',
    description: 'Trải nghiệm smartphone AI đầu tiên. Camera 200MP.',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
    bg: 'from-purple-900 to-purple-700',
    cta: 'Xem chi tiết',
    link: '/shop'
  },
  {
    id: 4,
    title: 'Sony WH-1000XM5',
    subtitle: 'Chống ồn hàng đầu',
    description: 'Chất âm hoàn hảo. Pin 30 giờ. Nhẹ nhàng thoải mái.',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
    bg: 'from-gray-800 to-gray-600',
    cta: 'Mua ngay',
    link: '/shop'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section 
      className="relative h-[400px] md:h-[500px] overflow-hidden bg-gray-900"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`} />
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-full flex items-center">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
                {/* Text Content */}
                <div className="text-white space-y-4 animate-slideRight">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    {slide.subtitle}
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/80 max-w-md">
                    {slide.description}
                  </p>
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      onClick={() => window.location.href = '/shop'}
                      className="h-12 px-6 text-base font-bold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 inline-flex items-center gap-2"
                    >
                      {slide.cta} <ArrowRight size={18} />
                    </button>
                    <button
                      onClick={() => window.location.href = '/shop'}
                      className="h-12 px-6 text-base font-medium border border-white/50 text-white rounded-md hover:bg-white/10 hover:border-white transition-all duration-200"
                    >
                      Tìm hiểu thêm
                    </button>
                  </div>
                </div>

                {/* Product Image */}
                <div className="hidden lg:block animate-fadeIn">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-white/10 rounded-3xl transform rotate-6" />
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="relative w-full h-[400px] object-cover rounded-3xl shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-colors text-white"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-colors text-white"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'w-8 bg-white' 
                : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ 
              width: `${((currentSlide * 100) / slides.length) + ((Date.now() % 5000) / 50)}%`,
              transition: 'width 0.1s linear'
            }}
          />
        </div>
      )}
    </section>
  );
}
