import React, { useEffect } from 'react';
import { ChevronRight, Smartphone, Laptop, Tv, Headphones, Watch, Gamepad2, Camera } from 'lucide-react';

const categories = [
  { 
    id: 1, 
    name: 'Điện thoại', 
    slug: 'dien-thoai',
    icon: Smartphone,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    subcategories: ['iPhone', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Realme'],
    featured: [
      { name: 'iPhone 15 Pro Max', price: '34.990.000₫', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200' },
      { name: 'Samsung S24 Ultra', price: '31.990.000₫', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200' },
    ]
  },
  { 
    id: 2, 
    name: 'Laptop', 
    slug: 'laptop',
    icon: Laptop,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    subcategories: ['MacBook', 'Dell', 'HP', 'Asus', 'Lenovo', 'Acer'],
    featured: [
      { name: 'MacBook Pro M3', price: '39.990.000₫', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200' },
      { name: 'Dell XPS 15', price: '45.990.000₫', image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=200' },
    ]
  },
  { 
    id: 3, 
    name: 'Máy tính bảng', 
    slug: 'may-tinh-bang',
    icon: Smartphone,
    color: 'text-green-600',
    bg: 'bg-green-50',
    subcategories: ['iPad', 'Samsung Galaxy Tab', 'Xiaomi Pad', 'Lenovo Tab'],
    featured: []
  },
  { 
    id: 4, 
    name: 'TV & Thiết bị giải trí', 
    slug: 'tv-thiet-bi-giai-tri',
    icon: Tv,
    color: 'text-red-600',
    bg: 'bg-red-50',
    subcategories: ['Smart TV', 'Android TV', 'QLED', 'OLED', 'Streaming Devices'],
    featured: []
  },
  { 
    id: 5, 
    name: 'Tai nghe', 
    slug: 'tai-nghe',
    icon: Headphones,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    subcategories: ['True Wireless', 'Over-ear', 'On-ear', 'Gaming', 'Wireless'],
    featured: []
  },
  { 
    id: 6, 
    name: 'Đồng hồ thông minh', 
    slug: 'dong-ho-thong-minh',
    icon: Watch,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    subcategories: ['Apple Watch', 'Samsung Watch', 'Xiaomi Watch', 'Garmin', 'Huawei'],
    featured: []
  },
  { 
    id: 7, 
    name: 'Thiết bị gaming', 
    slug: 'thiet-bi-gaming',
    icon: Gamepad2,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    subcategories: ['Console', 'Tay cầm', 'Ghế gaming', 'Bàn phím', 'Chuột'],
    featured: []
  },
  { 
    id: 8, 
    name: 'Máy ảnh', 
    slug: 'may-anh',
    icon: Camera,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    subcategories: ['Mirrorless', 'DSLR', 'Action Cam', 'Drone', 'Lens'],
    featured: []
  },
];

export default function MegaMenu({ onClose, onNavigate }) {
  const [activeCategory, setActiveCategory] = React.useState(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl z-50"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Categories List */}
          <div className="col-span-3">
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveCategory(cat)}
                  onClick={() => {
                    onNavigate('shop');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className={`p-2 rounded-lg ${cat.bg}`}>
                    <cat.icon size={18} className={cat.color} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 flex-1 text-left">
                    {cat.name}
                  </span>
                  <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-600" />
                </button>
              ))}
            </div>
          </div>

          {/* Category Details */}
          <div className="col-span-9 pl-6 border-l border-gray-100">
            {activeCategory ? (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl ${activeCategory.bg}`}>
                    <activeCategory.icon size={24} className={activeCategory.color} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{activeCategory.name}</h3>
                    <p className="text-sm text-gray-500">{activeCategory.subcategories.length} danh mục con</p>
                  </div>
                </div>

                {/* Subcategories */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Danh mục
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {activeCategory.subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          onNavigate('shop');
                          onClose();
                        }}
                        className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-left"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured Products */}
                {activeCategory.featured.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Sản phẩm nổi bật
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {activeCategory.featured.map((product, idx) => (
                        <div
                          key={idx}
                          className="group cursor-pointer"
                          onClick={() => {
                            onNavigate('shop');
                            onClose();
                          }}
                        >
                          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-sm font-bold text-blue-600">{product.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-5xl mb-4">🛍️</div>
                  <p className="text-sm">Di chuột vào danh mục để xem chi tiết</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
