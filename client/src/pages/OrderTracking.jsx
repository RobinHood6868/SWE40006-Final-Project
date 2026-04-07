import React, { useState } from 'react';
import { Package, Search, CheckCircle, Clock, Truck, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { formatCurrency, formatDate } from '../utils/formatters';

const API = '/api';

const orderStatusSteps = [
  { key: 'pending', label: 'Đã đặt', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { key: 'confirmed', label: 'Xác nhận', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'shipping', label: 'Đang giao', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
  { key: 'completed', label: 'Hoàn thành', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
];

export default function OrderTracking({ onNavigate }) {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    if (!orderId || !email) {
      setError('Vui lòng nhập đầy đủ mã đơn và email');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(
        `${API}/orders/lookup?id=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Không tìm thấy đơn hàng');
      }
      
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLookup();
    }
  };

  const currentStatusIndex = orderStatusSteps.findIndex(s => s.key === order?.status);

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Package size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tra cứu đơn hàng</h1>
          <p className="text-gray-600">
            Nhập mã đơn hàng và email để kiểm tra trạng thái vận chuyển
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 shadow-sm">
          <div className="space-y-4">
            <Input
              label="Mã đơn hàng"
              placeholder="Ví dụ: 42"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={handleKeyDown}
              required
            />
            <Input
              label="Email đặt hàng"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              required
            />

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700">
                <AlertTriangle size={20} className="flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button 
              onClick={handleLookup} 
              loading={loading}
              className="w-full"
              size="lg"
            >
              <Search size={18} className="mr-2" />
              Kiểm tra trạng thái
            </Button>
          </div>
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-6 animate-fadeIn">
            {/* Order Info Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Đơn hàng #{order.id}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Đặt ngày {formatDate(order.created_at)}
                  </p>
                </div>
                <div className={clsx(
                  'px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide',
                  order.status === 'pending' && 'bg-yellow-100 text-yellow-700',
                  order.status === 'confirmed' && 'bg-blue-100 text-blue-700',
                  order.status === 'shipping' && 'bg-purple-100 text-purple-700',
                  order.status === 'completed' && 'bg-green-100 text-green-700'
                )}>
                  {orderStatusSteps.find(s => s.key === order.status)?.label}
                </div>
              </div>

              {/* Status Timeline */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  {orderStatusSteps.map((step, index) => {
                    const isActive = index <= currentStatusIndex;
                    const isLast = index === orderStatusSteps.length - 1;
                    const Icon = step.icon;
                    
                    return (
                      <React.Fragment key={step.key}>
                        <div className="flex flex-col items-center flex-1">
                          <div className={clsx(
                            'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                            isActive ? step.bg : 'bg-gray-100',
                            isActive ? step.color : 'text-gray-400'
                          )}>
                            <Icon size={20} />
                          </div>
                          <span className={clsx(
                            'text-xs font-medium mt-2 text-center',
                            isActive ? 'text-gray-900' : 'text-gray-400'
                          )}>
                            {step.label}
                          </span>
                        </div>
                        {!isLast && (
                          <div className={clsx(
                            'flex-1 h-1 mx-2 rounded',
                            index < currentStatusIndex ? 'bg-blue-600' : 'bg-gray-200'
                          )} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Truck size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Địa chỉ giao hàng</h4>
                    <p className="text-sm text-gray-600">{order.shipping_address}</p>
                    {order.guest_phone && (
                      <p className="text-sm text-gray-600 mt-1">
                        SĐT: {order.guest_phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Sản phẩm ({order.items?.length})</h4>
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-gray-900 truncate">{item.name}</h5>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-gray-100 mt-6 pt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">Tổng cộng</span>
                <span className="text-xl font-bold text-red-600 font-mono">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Cần hỗ trợ thêm?</h4>
                  <p className="text-sm text-gray-600">
                    Liên hệ hotline 1900 6789 hoặc email contact@volta.vn
                  </p>
                </div>
                <Button variant="outline" className="flex-shrink-0">
                  Liên hệ
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!order && !loading && (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Nhập thông tin để tra cứu
            </h3>
            <p className="text-gray-600 text-sm">
              Mã đơn hàng và email sẽ được gửi đến bạn sau khi đặt hàng thành công
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
