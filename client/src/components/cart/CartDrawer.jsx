import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Gift, Truck } from 'lucide-react';
import { clsx } from 'clsx';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import { useCartStore } from '../../stores/cartStore';
import ProductImage from '../product/ProductImage';

export default function CartDrawer({ isOpen, onClose, onCheckout, onViewProduct }) {
  const { items, removeItem, updateQuantity, getTotal, isEmpty, clearCart } = useCartStore();
  const [step, setStep] = React.useState('cart'); // 'cart' | 'form' | 'success'
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    note: ''
  });
  const [errors, setErrors] = React.useState({});
  const [orderId, setOrderId] = React.useState(null);

  const shippingFee = getTotal() >= 500000 ? 0 : 30000;
  const finalTotal = getTotal() + shippingFee;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ 
            product_id: i.id, 
            quantity: i.qty, 
            price: i.price 
          })),
          guest_name: formData.name,
          guest_email: formData.email,
          guest_phone: formData.phone,
          shipping_address: formData.address,
          note: formData.note,
          total: finalTotal
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setOrderId(data.order_id);
        clearCart();
        setStep('success');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      alert('Đặt hàng thất bại: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl animate-slideLeft flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShoppingCart size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {step === 'cart' && `Giỏ hàng (${items.length})`}
                {step === 'form' && 'Thanh toán'}
                {step === 'success' && 'Đặt hàng thành công'}
              </h2>
              <p className="text-xs text-gray-500">
                {step === 'cart' && `${items.reduce((s, i) => s + i.qty, 0)} sản phẩm`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === 'cart' && (
            <div className="p-6">
              {isEmpty() ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingCart size={40} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium mb-2">Giỏ hàng trống</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Khám phá sản phẩm và thêm vào giỏ hàng
                  </p>
                  <Button onClick={onClose}>Mua sắm ngay</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div 
                        className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                        onClick={() => {
                          onViewProduct?.(item);
                          onClose();
                        }}
                      >
                        <ProductImage
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 
                          className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600"
                          onClick={() => {
                            onViewProduct?.(item);
                            onClose();
                          }}
                        >
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{item.category_name}</p>
                        <div className="text-base font-bold text-red-600 mt-1 font-mono">
                          {formatCurrency(item.price)}
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Free Shipping Progress */}
                  {getTotal() < 500000 && (
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                          Thêm {formatCurrency(500000 - getTotal())} để được miễn phí vận chuyển
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                          style={{ width: `${(getTotal() / 500000) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 'form' && (
            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                  Tóm tắt đơn hàng
                </h3>
                <div className="space-y-2 text-sm">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-gray-600">
                      <span className="truncate">{item.name} × {item.qty}</span>
                      <span className="font-mono">{formatCurrency(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-mono">{formatCurrency(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className={clsx('font-mono', shippingFee === 0 && 'text-green-600')}>
                      {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                    <span>Tổng cộng</span>
                    <span className="font-mono text-red-600">{formatCurrency(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900">Thông tin giao hàng</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={clsx(
                      'w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all',
                      errors.name && 'border-red-500'
                    )}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={clsx(
                        'w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all',
                        errors.email && 'border-red-500'
                      )}
                      placeholder="email@example.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={clsx(
                        'w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all',
                        errors.phone && 'border-red-500'
                      )}
                      placeholder="0912345678"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={clsx(
                      'w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all',
                      errors.address && 'border-red-500'
                    )}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Ghi chú
                  </label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    placeholder="Ghi chú về giao hàng, màu sắc, size..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h3>
              <p className="text-gray-600 mb-4">
                Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ sớm nhất.
              </p>
              {orderId && (
                <div className="bg-gray-50 px-6 py-3 rounded-lg mb-6">
                  <p className="text-sm text-gray-500">Mã đơn hàng</p>
                  <p className="text-lg font-bold font-mono text-gray-900">#{orderId}</p>
                </div>
              )}
              <Button onClick={onClose} className="w-full">
                Tiếp tục mua sắm
              </Button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step === 'cart' && !isEmpty() && (
          <div className="p-6 border-t border-gray-100 flex-shrink-0 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tổng cộng:</span>
              <span className="text-xl font-bold font-mono text-red-600">
                {formatCurrency(getTotal())}
              </span>
            </div>
            <Button onClick={() => setStep('form')} size="lg" className="w-full">
              Tiến hành thanh toán <ArrowRight size={18} />
            </Button>
          </div>
        )}

        {step === 'form' && (
          <div className="p-6 border-t border-gray-100 flex-shrink-0 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tổng thanh toán:</span>
              <span className="text-xl font-bold font-mono text-red-600">
                {formatCurrency(finalTotal)}
              </span>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep('cart')}
                className="flex-1"
              >
                Quay lại
              </Button>
              <Button 
                onClick={handleSubmitOrder}
                size="lg" 
                className="flex-1 bg-black hover:bg-gray-800"
              >
                Đặt hàng ngay
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
