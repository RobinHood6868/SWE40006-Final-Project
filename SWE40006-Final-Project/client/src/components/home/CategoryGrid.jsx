import React from 'react';
import { Smartphone, Laptop, Tv, Headphones, Watch, Gamepad2, Camera, Zap } from 'lucide-react';

const categories = [
  { id: 1, name: 'Điện thoại', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50', count: 234 },
  { id: 2, name: 'Laptop', icon: Laptop, color: 'text-purple-600', bg: 'bg-purple-50', count: 156 },
  { id: 3, name: 'Tablet', icon: Smartphone, color: 'text-green-600', bg: 'bg-green-50', count: 89 },
  { id: 4, name: 'TV & Giải trí', icon: Tv, color: 'text-red-600', bg: 'bg-red-50', count: 67 },
  { id: 5, name: 'Tai nghe', icon: Headphones, color: 'text-pink-600', bg: 'bg-pink-50', count: 312 },
  { id: 6, name: 'Đồng hồ', icon: Watch, color: 'text-orange-600', bg: 'bg-orange-50', count: 145 },
  { id: 7, name: 'Gaming', icon: Gamepad2, color: 'text-indigo-600', bg: 'bg-indigo-50', count: 198 },
  { id: 8, name: 'Máy ảnh', icon: Camera, color: 'text-teal-600', bg: 'bg-teal-50', count: 76 },
];

export default function CategoryGrid() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Danh mục nổi bật</h2>
          <p className="text-gray-600">Khám phá sản phẩm theo danh mục bạn quan tâm</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group cursor-pointer"
            >
              <div className={`aspect-square ${cat.bg} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300`}>
                <cat.icon size={32} className={cat.color} />
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-500 text-center mt-1">
                {cat.count} sản phẩm
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
