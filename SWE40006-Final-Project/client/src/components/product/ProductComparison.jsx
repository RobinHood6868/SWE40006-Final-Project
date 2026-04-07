import React from 'react';
import { X, Check, Star, Zap, Shield, Truck } from 'lucide-react';
import { clsx } from 'clsx';
import { formatCurrency, calculateDiscount } from '../../utils/formatters';
import { Rating } from '../common/Rating';
import { Button } from '../common/Button';
import ProductImage from './ProductImage';

export default function ProductComparison({ products, onRemove, onClose }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">⚖️</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Chưa có sản phẩm để so sánh</h3>
        <p className="text-gray-600">Thêm sản phẩm vào để so sánh tính năng và giá cả</p>
      </div>
    );
  }

  const specs = [
    { key: 'price', label: 'Giá', icon: null, format: (p) => formatCurrency(p.price) },
    { key: 'discount', label: 'Giảm giá', icon: Zap, format: (p) => {
      const discount = calculateDiscount(p.original_price, p.price);
      return discount ? `-${discount}%` : '0%';
    }},
    { key: 'rating', label: 'Đánh giá', icon: Star, format: (p) => (
      <Rating value={p.rating || 4.5} count={p.review_count || 0} size="sm" />
    )},
    { key: 'category', label: 'Danh mục', icon: null, format: (p) => p.category_name },
    { key: 'stock', label: 'Tình trạng', icon: Check, format: (p) => (
      <span className={clsx('font-medium', p.stock > 0 ? 'text-green-600' : 'text-red-600')}>
        {p.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
      </span>
    )},
    { key: 'warranty', label: 'Bảo hành', icon: Shield, format: () => '12 tháng' },
    { key: 'shipping', label: 'Vận chuyển', icon: Truck, format: () => 'Miễn phí' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            So sánh sản phẩm ({products.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(90vh-80px)]">
          <table className="w-full min-w-[600px]">
            {/* Product Images & Names */}
            <thead className="sticky top-0 bg-white z-10">
              <tr>
                <th className="p-4 text-left w-48 border-b border-r border-gray-100"></th>
                {products.map((product) => (
                  <th key={product.id} className="p-4 w-64 border-b border-gray-100">
                    <div className="relative">
                      <button
                        onClick={() => onRemove(product.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                      >
                        <X size={14} />
                      </button>
                      <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
                        <ProductImage
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Specifications */}
            <tbody>
              {specs.map((spec, idx) => (
                <tr key={spec.key} className={clsx(idx % 2 === 0 ? 'bg-gray-50' : 'bg-white')}>
                  <td className="p-4 border-r border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      {spec.icon && <spec.icon size={16} className="text-blue-600" />}
                      {spec.label}
                    </div>
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      {spec.format(product)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              So sánh {products.length} sản phẩm. Thêm tối đa 4 sản phẩm.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
              <Button onClick={() => {
                // Add all to cart
                onClose();
              }}>
                Thêm tất cả vào giỏ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
