import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-xl font-bold font-mono mb-4">
              Volt<span className="text-blue-600">a</span>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Điểm đến uy tín cho tín đồ công nghệ. Chúng tôi cung cấp các sản phẩm chính hãng 
              với dịch vụ bảo hành tận tâm và giá cả cạnh tranh.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-full transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="p-2 bg-gray-100 hover:bg-pink-600 hover:text-white rounded-full transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="p-2 bg-gray-100 hover:bg-blue-400 hover:text-white rounded-full transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="p-2 bg-gray-100 hover:bg-red-600 hover:text-white rounded-full transition-colors">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide mb-4 text-gray-900">Khám phá</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Sản phẩm mới</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Bán chạy nhất</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Khuyến mãi</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Flash Sale</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Cửa hàng</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide mb-4 text-gray-900">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Trung tâm trợ giúp</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Chính sách bảo hành</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Vận chuyển & Giao hàng</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Hoàn trả & Hoàn tiền</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Câu hỏi thường gặp</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide mb-4 text-gray-900">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-blue-600" />
                <span>1900 6789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-blue-600" />
                <span>contact@volta.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-blue-600" />
                <span>123 Tech St, Ba Đình, Hà Nội</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 font-medium">Giờ làm việc:</p>
              <p className="text-xs text-blue-600">8:00 - 21:00 (T2 - CN)</p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-100 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🚚</div>
              <p className="text-xs font-medium text-gray-700">Giao hàng nhanh</p>
              <p className="text-xs text-gray-500">Trong 24h</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🛡️</div>
              <p className="text-xs font-medium text-gray-700">Bảo hành chính hãng</p>
              <p className="text-xs text-gray-500">12-24 tháng</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">💳</div>
              <p className="text-xs font-medium text-gray-700">Thanh toán linh hoạt</p>
              <p className="text-xs text-gray-500">Nhiều phương thức</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">📞</div>
              <p className="text-xs font-medium text-gray-700">Hỗ trợ 24/7</p>
              <p className="text-xs text-gray-500">Tư vấn miễn phí</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2025 Volta Store. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="hover:text-blue-600 cursor-pointer">Điều khoản</span>
            <span className="hover:text-blue-600 cursor-pointer">Bảo mật</span>
            <span className="hover:text-blue-600 cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
