import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, ShoppingCart, X, Plus, Minus, CheckCircle, 
  ArrowRight, Package, Star, Filter, Info, AlertTriangle 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const API = '/api';

// Utility for formatting currency
const fmt = n => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
const disc = (o, c) => o && o > c ? Math.round((1 - c / o) * 100) : null;
const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

// --- Components ---
function ProductImage({ src, alt, className }) {
  const [err, setErr] = useState(false);
  const placeholder = 'https://images.unsplash.com/photo-1560393464-5c69a71c57a3?w=400&q=80'; // Premium dark tech placeholder
  return (
    <img 
      src={err ? placeholder : src} 
      alt={alt} 
      className={className}
      onError={() => !err && setErr(true)}
      loading="lazy"
    />
  );
}

function Toast({ msg, type = 'info', onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={twMerge(
      "toast transition-all duration-300",
      type === 'error' ? "bg-red-600" : "bg-black"
    )}>
      {msg}
    </div>
  );
}

function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target.className === 'modal-backdrop' && onClose()}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
        <div className="modal-img">
          <ProductImage src={product.image_url} alt={product.name} />
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <span className="prod-cat">{product.category_name}</span>
            <h2 className="text-2xl font-bold mt-1">{product.name}</h2>
            <div className="prod-rating mt-2">
              <b>{stars(product.rating)}</b> ({product.review_count} đánh giá)
            </div>
          </div>
          
          <div className="prod-price py-4 border-y border-gray-100">
            <div className="text-2xl font-bold">{fmt(product.price)}</div>
            {product.original_price > product.price && (
              <div className="was text-base">{fmt(product.original_price)}</div>
            )}
          </div>

          <div className="text-gray-600 text-sm leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: product.description || "Chưa có mô tả chi tiết cho sản phẩm này." }} />
          </div>

          <div className="mt-auto">
            <button 
              className="w-full h-12 bg-black text-white rounded-md font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
            >
              <Plus size={20} /> Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main App ---

export default function App() {
  // State
  const [dbConn, setDbConn] = useState(true); // Default to true as we assume server is connected
  const [view, setView] = useState('shop');
  const [products, setProducts] = useState([]);
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [activeCat, setActiveCat] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('volta_cart') || '[]'); } catch { return []; }
  });
  const [showCart, setShowCart] = useState(false);
  const [cartStep, setCartStep] = useState('cart');
  const [lastOrderId, setLastOrderId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', note: '' });
  const [formErr, setFormErr] = useState({});
  const [placing, setPlacing] = useState(false);

  const [track, setTrack] = useState({ id: '', email: '', result: null, err: '', loading: false });
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Search Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Persist cart
  useEffect(() => { localStorage.setItem('volta_cart', JSON.stringify(cart)); }, [cart]);

  // Load Categories & Total Count once
  useEffect(() => {
    const init = async () => {
      try {
        const [cData, pData] = await Promise.all([
          fetch(`${API}/categories`).then(r => r.json()),
          fetch(`${API}/products`).then(r => r.json())
        ]);
        setCats(Array.isArray(cData) ? cData : []);
        setTotalProductCount(Array.isArray(pData) ? pData.length : 0);
      } catch (err) {
        showToast('Không thể tải dữ liệu ban đầu', 'error');
      }
    };
    init();
  }, []);

  // Load Products on filter/search change
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const p = new URLSearchParams();
        if (activeCat) p.set('category', activeCat);
        if (debouncedSearch) p.set('search', debouncedSearch);
        const data = await fetch(`${API}/products?${p}`).then(r => r.json());
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        showToast('Lỗi khi tải danh sách sản phẩm', 'error');
      }
      setLoading(false);
    };
    loadProducts();
  }, [activeCat, debouncedSearch]);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type, id: Date.now() });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const changeView = (v) => {
    if (view === v) return;
    setViewLoading(true);
    setTimeout(() => {
      setView(v);
      setViewLoading(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }];
    });
    showToast(`Đã thêm ${p.name} vào giỏ`);
  };

  const updateQty = (id, d) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const placeOrder = async () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.address.trim()) e.address = true;
    
    // Stricter email validation
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = true;
    
    // Vietnamese phone validation (simple check)
    if (form.phone && !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(form.phone.replace(/\s/g, ''))) e.phone = true;
    
    setFormErr(e);
    if (Object.keys(e).length > 0) return;

    setPlacing(true);
    try {
      const r = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({ product_id: i.id, quantity: i.qty, price: i.price })),
          guest_name: form.name, guest_email: form.email, guest_phone: form.phone,
          shipping_address: form.address, note: form.note, total: cartTotal
        })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setLastOrderId(d.order_id);
      setCart([]);
      setCartStep('success');
    } catch (err) {
      showToast(err.message, 'error');
    }
    setPlacing(false);
  };

  const lookupOrder = async () => {
    if (!track.id || !track.email) { setTrack({ ...track, err: 'Vui lòng nhập đầy đủ' }); return; }
    setTrack({ ...track, loading: true, err: '', result: null });
    try {
      const r = await fetch(`${API}/orders/lookup?id=${encodeURIComponent(track.id)}&email=${encodeURIComponent(track.email)}`);
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setTrack({ ...track, result: d, loading: false });
    } catch (err) {
      setTrack({ ...track, err: err.message, loading: false });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      {/* Navbar */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="brand" onClick={() => { setView('shop'); setActiveCat(''); setSearch(''); }}>
            Volt<span>a</span>
          </div>
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={e => setSearch(e.target.value.slice(0, 50))}
            />
          </div>
          <div className="nav-right">
            <button className="nav-btn" onClick={() => changeView(view === 'track' ? 'shop' : 'track')}>
              <Package size={16} /> <span>{view === 'track' ? 'Cửa hàng' : 'Tra đơn hàng'}</span>
            </button>
            <button className="nav-btn primary relative" onClick={() => { setShowCart(true); setCartStep('cart'); }}>
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className="cart-count absolute -top-1 -right-1">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      <main className="page">
        {viewLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : view === 'shop' ? (
          <div className="wrap">
            {/* Hero */}
            <section className="hero">
              <div className="hero-inner">
                <div>
                  <div className="hero-label">// Tech Store — Premium Selection</div>
                  <h1>Công nghệ<br />đỉnh cao,<br />giá <em>tốt nhất</em></h1>
                  <p className="hero-sub">Hàng chính hãng, bảo hành toàn quốc, giao hàng nhanh trong 24h.</p>
                  <div className="hero-actions">
                    <button className="btn-dark" onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}>
                      Mua ngay <ArrowRight size={16} />
                    </button>
                    <button className="btn-ghost" onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}>
                      Xem danh mục
                    </button>
                  </div>
                </div>
                <div className="hero-stat-row">
                  <div className="hero-stat">
                    <div className="hero-stat-n text-accent">{totalProductCount}</div>
                    <div className="hero-stat-l">Sản phẩm</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-n">{cats.length}</div>
                    <div className="hero-stat-l">Danh mục</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Filters */}
            <div className="filters scroll-mt-20" id="catalog">
              <button 
                className={clsx("filter-chip", activeCat === '' && "on")} 
                onClick={() => setActiveCat('')}
              >
                Tất cả <span className="filter-count">{totalProductCount}</span>
              </button>
              {cats.map(c => (
                <button 
                  key={c.id} 
                  className={clsx("filter-chip", activeCat === c.slug && "on")} 
                  onClick={() => setActiveCat(c.slug)}
                >
                  {c.name} <span className="filter-count font-bold">{c.product_count}</span>
                </button>
              ))}
            </div>

            {/* Grid Head */}
            <div className="grid-head">
              <h2>{activeCat ? cats.find(c => c.slug === activeCat)?.name || 'Sản phẩm' : 'Tất cả sản phẩm'}</h2>
              <span className="text-gray-500">{loading ? 'Đang tải...' : `${products.length} sản phẩm được tìm thấy`}</span>
            </div>

            {/* Products Grid */}
            <div className="products">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white">
                    <div className="skel h-[180px]" />
                    <div className="p-4 space-y-3">
                      <div className="skel h-3 w-1/3" />
                      <div className="skel h-4 w-full" />
                      <div className="skel h-4 w-2/3" />
                    </div>
                  </div>
                ))
              ) : products.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-400">
                  <Info className="mx-auto mb-4" size={48} />
                  <p>Không tìm thấy sản phẩm nào phù hợp</p>
                </div>
              ) : (
                products.map(p => {
                  const d = disc(p.original_price, p.price);
                  return (
                    <article 
                      key={p.id} 
                      className="prod-card group" 
                      onClick={() => setSelectedProduct(p)}
                    >
                      <div className="prod-img">
                        <ProductImage src={p.image_url} alt={p.name} />
                        {d && <div className="prod-discount">−{d}%</div>}
                      </div>
                      <div className="prod-body">
                        <span className="prod-cat">{p.category_name}</span>
                        <h3 className="prod-name group-hover:text-accent transition-colors">{p.name}</h3>
                        {p.rating > 0 && (
                          <div className="prod-rating">
                            <b>{stars(p.rating)}</b> ({p.review_count})
                          </div>
                        )}
                        <div className="prod-foot">
                          <div className="prod-price">
                            <div className="now">{fmt(p.price)}</div>
                            {p.original_price > p.price && <div className="was">{fmt(p.original_price)}</div>}
                          </div>
                          <button 
                            className="add-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(p);
                            }}
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* Track Order View */
          <div className="wrap track-page">
            <div className="track-card">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <Package className="text-accent" /> Tra cứu đơn hàng
              </h2>
              <p className="text-gray-500 mb-6">Nhập mã đơn và email đã dùng khi đặt hàng.</p>
              
              <div className="space-y-4">
                <div className="field">
                  <label>Mã đơn hàng</label>
                  <input 
                    placeholder="VD: 42" 
                    value={track.id} 
                    onChange={e => setTrack({ ...track, id: e.target.value })} 
                  />
                </div>
                <div className="field">
                  <label>Email của bạn</label>
                  <input 
                    type="email" 
                    placeholder="example@gmail.com" 
                    value={track.email} 
                    onChange={e => setTrack({ ...track, email: e.target.value })} 
                    onKeyDown={e => e.key === 'Enter' && lookupOrder()}
                  />
                </div>
                
                {track.err && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md text-sm border border-red-100">
                    <AlertTriangle size={16} /> {track.err}
                  </div>
                )}
                
                <button 
                  className="place-btn mt-4 flex items-center justify-center gap-2" 
                  onClick={lookupOrder} 
                  disabled={track.loading}
                >
                  {track.loading ? 'Đang tìm...' : 'Kiểm tra trạng thái'}
                </button>
              </div>

              {track.result && (
                <div className="track-result mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="track-result-head">
                    <span className="text-lg">Đơn hàng #{track.result.id}</span>
                    <span className={clsx(
                      "status-badge",
                      track.result.status === 'pending' ? 's-pending' : 's-completed'
                    )}>
                      {track.result.status === 'pending' ? 'Chất lượng xử lý' : 'Đã hoàn tất'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4 bg-white p-3 rounded border border-gray-100 italic">
                    📍 {track.result.shipping_address}
                  </div>
                  <div className="track-items flex gap-2 mb-4 overflow-x-auto pb-2">
                    {track.result.items?.map(i => (
                      <ProductImage key={i.id} src={i.image_url} alt={i.name} className="track-thumb w-12 h-12" title={i.name} />
                    ))}
                  </div>
                  <div className="track-total border-t border-dashed border-gray-300 pt-4">
                    <span className="text-gray-500 font-medium">
                      {track.result.items?.length} sản phẩm · {new Date(track.result.created_at).toLocaleDateString('vi-VN')}
                    </span>
                    <b className="text-lg text-black">{fmt(track.result.total)}</b>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="footer mt-12 pt-16 pb-8 bg-white border-t border-gray-100">
        <div className="wrap grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="brand mb-4">Volt<span>a</span></div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Điểm đến uy tín cho tín đồ công nghệ. Chúng tôi cung cấp các sản phẩm chính hãng với dịch vụ bảo hành tận tâm.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Khám phá</h4>
            <ul className="text-gray-500 text-sm space-y-2">
              <li className="hover:text-accent cursor-pointer">Sản phẩm mới</li>
              <li className="hover:text-accent cursor-pointer">Bán chạy nhất</li>
              <li className="hover:text-accent cursor-pointer">Khuyến mãi</li>
              <li className="hover:text-accent cursor-pointer">Cửa hàng</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Hỗ trợ</h4>
            <ul className="text-gray-500 text-sm space-y-2">
              <li className="hover:text-accent cursor-pointer">Trung tâm trợ giúp</li>
              <li className="hover:text-accent cursor-pointer">Chính sách bảo hành</li>
              <li className="hover:text-accent cursor-pointer">Vận chuyển & Giao hàng</li>
              <li className="hover:text-accent cursor-pointer">Hoàn trả & Hoàn tiền</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Liên hệ</h4>
            <ul className="text-gray-500 text-sm space-y-2">
              <li className="flex items-center gap-2">📞 1900 6789</li>
              <li className="flex items-center gap-2">✉️ contact@volta.vn</li>
              <li className="flex items-center gap-2">📍 123 Tech St, Ba Dinh, HN</li>
            </ul>
          </div>
        </div>
        <div className="wrap border-t border-gray-100 pt-8">
          <p className="text-gray-400 text-xs">© 2025 Volta Store. Crafted with precision for high performance. All rights reserved.</p>
        </div>
      </footer>

      {/* Cart Drawer */}
      {showCart && (
        <div className="backdrop z-50 transition-opacity duration-300" onClick={(e) => e.target.className === 'backdrop' && setShowCart(false)}>
          <div className="drawer shadow-2xl">
            <div className="drawer-head flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold">
                {cartStep === 'cart' && `Giỏ hàng (${cartCount})`}
                {cartStep === 'form' && 'Thanh toán'}
                {cartStep === 'success' && 'Hoàn thành'}
              </h2>
              <button className="x-btn hover:rotate-90 transition-transform" onClick={() => setShowCart(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body flex-1 overflow-y-auto p-6">
              {cartStep === 'cart' && (
                cart.length === 0 ? (
                  <div className="cart-empty-state text-center py-20 text-gray-400">
                    <div className="text-6xl mb-4 opacity-20">🛒</div>
                    <p className="font-medium">Giỏ hàng của bạn đang trống</p>
                    <button className="text-accent underline mt-2" onClick={() => setShowCart(false)}>Khám phá sản phẩm</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item flex gap-4 animate-in slide-in-from-right-4">
                        <ProductImage src={item.image_url} alt={item.name} className="ci-img w-20 h-20 rounded-lg object-cover" />
                        <div className="ci-info flex-1">
                          <h4 className="font-bold mb-1 leading-tight">{item.name}</h4>
                          <span className="text-accent font-bold font-mono">{fmt(item.price)}</span>
                          <div className="flex items-center gap-3 mt-3">
                            <button className="qty-btn" onClick={() => updateQty(item.id, -1)}><Minus size={12} /></button>
                            <span className="font-bold">{item.qty}</span>
                            <button className="qty-btn" onClick={() => updateQty(item.id, 1)}><Plus size={12} /></button>
                          </div>
                        </div>
                        <button className="ci-remove self-start" onClick={() => removeItem(item.id)}><X size={16} /></button>
                      </div>
                    ))}
                  </div>
                )
              )}

              {cartStep === 'form' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h4 className="text-xs uppercase font-bold text-gray-400 mb-3 tracking-wider">Tóm tắt đơn hàng</h4>
                    {cart.map(i => (
                      <div key={i.id} className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 truncate max-w-[200px]">{i.name} × {i.qty}</span>
                        <span className="font-mono">{fmt(i.price * i.qty)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-base mt-4 pt-4 border-t border-gray-200">
                      <span>Tổng tiền</span>
                      <span className="text-black font-mono">{fmt(cartTotal)}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold border-l-4 border-accent pl-3">Thông tin giao hàng</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="field">
                        <label>Họ tên *</label>
                        <input className={clsx(formErr.name && "err")} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                      </div>
                      <div className="field">
                        <label>Điện thoại</label>
                        <input className={clsx(formErr.phone && "err")} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="09xx xxx xxx" />
                      </div>
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input className={clsx(formErr.email && "err")} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="field">
                      <label>Địa chỉ đầy đủ *</label>
                      <textarea className={clsx(formErr.address && "err")} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={3} />
                    </div>
                  </div>
                </div>
              )}

              {cartStep === 'success' && (
                <div className="text-center py-12 px-4 anime-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h3>
                  <p className="text-gray-500 mb-8 leading-relaxed">Cảm ơn bạn đã tin tưởng Volta. Đơn hàng của bạn sẽ sớm được chuẩn bị.</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-widest block mb-2">Mã đơn hàng của bạn</span>
                    <span className="text-2xl font-mono font-bold text-black font-mono">#{lastOrderId}</span>
                  </div>
                  <p className="text-xs text-info italic">Vui lòng lưu lại mã đơn để tiện tra cứu sau này.</p>
                </div>
              )}
            </div>

            <div className="drawer-foot p-6 border-t bg-gray-50">
              {cartStep === 'cart' && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-medium">Tổng tiền ước tính</span>
                    <span className="text-2xl font-bold font-mono">{fmt(cartTotal)}</span>
                  </div>
                  <button 
                    className="w-full h-14 bg-black text-white rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3" 
                    onClick={() => setCartStep('form')} 
                    disabled={cart.length === 0}
                  >
                    Tiến hành thanh toán <ArrowRight size={20} />
                  </button>
                </>
              )}
              {cartStep === 'form' && (
                <div className="flex flex-col gap-3">
                  <button 
                    className="w-full h-14 bg-accent text-white rounded-lg font-bold hover:bg-accent-hover transition-colors flex items-center justify-center gap-2" 
                    onClick={placeOrder} 
                    disabled={placing}
                  >
                    {placing ? 'Đang xử lý giao dịch...' : `Xác nhận đặt hàng · ${fmt(cartTotal)}`}
                  </button>
                  <button className="text-gray-500 font-medium py-2 hover:text-black" onClick={() => setCartStep('cart')}>Quay lại giỏ hàng</button>
                </div>
              )}
              {cartStep === 'success' && (
                <button 
                  className="w-full h-14 bg-black text-white rounded-lg font-bold" 
                  onClick={() => { setShowCart(false); setView('shop'); }}
                >
                  Tiếp tục mua sắm
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={addToCart}
        />
      )}

      {toast && (
        <Toast 
          key={toast.id} 
          msg={toast.msg} 
          type={toast.type} 
          onDone={() => setToast(null)} 
        />
      )}
    </div>
  );
}
