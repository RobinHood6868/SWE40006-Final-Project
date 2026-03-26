import { getPool } from './db.js';

export async function seedMoreProducts() {
  const client = await getPool().connect();
  try {
    // First, add more categories
    const existingCats = await client.query('SELECT slug FROM categories');
    const existingSlugs = existingCats.rows.map(r => r.slug);
    
    const newCategories = [
      { name: 'Máy tính bảng', slug: 'may-tinh-bang' },
      { name: 'TV & Thiết bị giải trí', slug: 'tv-thiet-bi-giai-tri' },
      { name: 'Thiết bị gaming', slug: 'thiet-bi-gaming' },
      { name: 'Máy ảnh', slug: 'may-anh' },
      { name: 'Loa & Âm thanh', slug: 'loa-am-thanh' },
      { name: 'Phụ kiện máy tính', slug: 'phu-kien-may-tinh' },
    ];
    
    for (const cat of newCategories) {
      if (!existingSlugs.includes(cat.slug)) {
        await client.query(
          'INSERT INTO categories (name, slug) VALUES ($1, $2)',
          [cat.name, cat.slug]
        );
        console.log(`✅ Added category: ${cat.name}`);
      }
    }

    // Get all category IDs
    const cats = await client.query('SELECT id, slug FROM categories');
    const catMap = {};
    cats.rows.forEach(c => { catMap[c.slug] = c.id; });

    // Add more products
    const products = [
      // Điện thoại
      { name: 'iPhone 15 Plus', description: 'Màn hình 6.7 inch, chip A16 Bionic, camera 48MP', price: 24990000, original_price: 27990000, image: 'https://images.unsplash.com/photo-1592286927505-b0e2cv15479b?w=400', slug: 'dien-thoai', stock: 40, rating: 4.7, reviews: 876 },
      { name: 'iPhone 14 Pro', description: 'Dynamic Island, chip A16, camera 48MP Pro', price: 22990000, original_price: 26990000, image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400', slug: 'dien-thoai', stock: 30, rating: 4.8, reviews: 1543 },
      { name: 'Samsung Galaxy Z Flip5', description: 'Màn hình gập, Snapdragon 8 Gen 2, camera 12MP', price: 21990000, original_price: 24990000, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=400', slug: 'dien-thoai', stock: 25, rating: 4.6, reviews: 654 },
      { name: 'OPPO Find N3', description: 'Màn hình gập, camera Hasselblad, Snapdragon 8 Gen 2', price: 23990000, original_price: 26990000, image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400', slug: 'dien-thoai', stock: 20, rating: 4.5, reviews: 432 },
      { name: 'Google Pixel 8 Pro', description: 'AI Magic Editor, Tensor G3, camera 50MP', price: 19990000, original_price: 22990000, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=400', slug: 'dien-thoai', stock: 15, rating: 4.7, reviews: 567 },
      
      // Laptop
      { name: 'MacBook Air M2', description: 'Thiết kế mỏng nhẹ, chip M2, màn hình Liquid Retina', price: 27990000, original_price: 31990000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', slug: 'laptop', stock: 35, rating: 4.8, reviews: 1234 },
      { name: 'MacBook Air M3', description: 'Chip M3 mới nhất, pin 18 giờ, hỗ trợ 2 màn hình', price: 32990000, original_price: 35990000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', slug: 'laptop', stock: 25, rating: 4.9, reviews: 567 },
      { name: 'Asus ROG Zephyrus G14', description: 'AMD Ryzen 9, RTX 4060, màn hình 144Hz', price: 35990000, original_price: 39990000, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', slug: 'laptop', stock: 18, rating: 4.7, reviews: 432 },
      { name: 'HP Spectre x360', description: '2-in-1 convertible, OLED 4K, Intel Core i7', price: 38990000, original_price: 42990000, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', slug: 'laptop', stock: 12, rating: 4.6, reviews: 321 },
      { name: 'Lenovo ThinkPad X1 Carbon', description: 'Business ultrabook, carbon fiber, Intel vPro', price: 42990000, original_price: 47990000, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', slug: 'laptop', stock: 10, rating: 4.8, reviews: 654 },
      
      // Máy tính bảng
      { name: 'iPad Pro M2 11"', description: 'Chip M2, màn hình Liquid Retina, Apple Pencil 2', price: 22990000, original_price: 25990000, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', slug: 'may-tinh-bang', stock: 30, rating: 4.8, reviews: 876 },
      { name: 'iPad Air 5 M1', description: 'Chip M1, màn hình 10.9 inch, USB-C', price: 14990000, original_price: 17990000, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', slug: 'may-tinh-bang', stock: 45, rating: 4.7, reviews: 654 },
      { name: 'Samsung Galaxy Tab S9', description: 'Màn hình AMOLED 11", S Pen, Snapdragon 8 Gen 2', price: 18990000, original_price: 21990000, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', slug: 'may-tinh-bang', stock: 25, rating: 4.6, reviews: 432 },
      { name: 'Xiaomi Pad 6', description: 'Màn hình 11" 144Hz, Snapdragon 870, pin 8840mAh', price: 8990000, original_price: 10990000, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', slug: 'may-tinh-bang', stock: 50, rating: 4.5, reviews: 543 },
      
      // Tai nghe
      { name: 'AirPods Max', description: 'Over-ear, ANC chủ động, âm thanh không gian', price: 13990000, original_price: 15990000, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', slug: 'tai-nghe', stock: 20, rating: 4.7, reviews: 765 },
      { name: 'Samsung Galaxy Buds2 Pro', description: 'ANC thông minh, âm thanh 360, pin 8 giờ', price: 4490000, original_price: 5490000, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', slug: 'tai-nghe', stock: 60, rating: 4.5, reviews: 543 },
      { name: 'Jabra Elite 85t', description: 'ANC tiên tiến, 6 mic, âm thanh tùy chỉnh', price: 5990000, original_price: 7490000, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', slug: 'tai-nghe', stock: 35, rating: 4.6, reviews: 432 },
      { name: 'Sennheiser Momentum 4', description: 'Audiophile sound, ANC, pin 60 giờ', price: 8990000, original_price: 10990000, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', slug: 'tai-nghe', stock: 25, rating: 4.8, reviews: 321 },
      
      // Đồng hồ thông minh
      { name: 'Apple Watch Ultra 2', description: 'Titanium, GPS chính xác, pin 36 giờ', price: 19990000, original_price: 22990000, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', slug: 'dong-ho-thong-minh', stock: 15, rating: 4.9, reviews: 543 },
      { name: 'Samsung Galaxy Watch6 Classic', description: 'Viền xoay, theo dõi sức khỏe, Wear OS', price: 9990000, original_price: 11990000, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', slug: 'dong-ho-thong-minh', stock: 30, rating: 4.6, reviews: 432 },
      { name: 'Garmin Fenix 7X', description: 'GPS đa băng tần, pin 28 ngày, thể thao outdoor', price: 18990000, original_price: 21990000, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', slug: 'dong-ho-thong-minh', stock: 12, rating: 4.8, reviews: 321 },
      { name: 'Xiaomi Watch 2 Pro', description: 'Wear OS, Snapdragon W5+, GPS kép', price: 5990000, original_price: 7490000, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', slug: 'dong-ho-thong-minh', stock: 40, rating: 4.4, reviews: 543 },
      
      // Phụ kiện
      { name: 'Sạc Anker 65W GaN', description: '3 cổng, công nghệ GaN, sạc nhanh PD', price: 1190000, original_price: 1490000, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', slug: 'phu-kien', stock: 200, rating: 4.7, reviews: 1234 },
      { name: 'Hub Anker 7-in-1', description: 'USB-C, HDMI 4K, USB 3.0, SD card', price: 1490000, original_price: 1890000, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', slug: 'phu-kien', stock: 150, rating: 4.6, reviews: 876 },
      { name: 'Chuột Logitech MX Master 3S', description: '8K DPI, silent click, pin 70 ngày', price: 2490000, original_price: 2990000, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', slug: 'phu-kien-may-tinh', stock: 80, rating: 4.8, reviews: 1543 },
      { name: 'Bàn phím Keychron K2', description: 'Mechanical, wireless, hot-swappable', price: 2190000, original_price: 2590000, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400', slug: 'phu-kien-may-tinh', stock: 60, rating: 4.7, reviews: 987 },
      { name: 'Màn hình Dell UltraSharp 27"', description: '4K USB-C, IPS Black, 100% sRGB', price: 12990000, original_price: 14990000, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', slug: 'phu-kien-may-tinh', stock: 20, rating: 4.8, reviews: 543 },
      
      // TV & Giải trí
      { name: 'LG OLED C3 55"', description: '4K 120Hz, α9 AI Processor, Dolby Vision IQ', price: 34990000, original_price: 39990000, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', slug: 'tv-thiet-bi-giai-tri', stock: 10, rating: 4.9, reviews: 432 },
      { name: 'Samsung QN90C Neo QLED 65"', description: 'Mini LED, Quantum Matrix, Gaming Hub', price: 45990000, original_price: 52990000, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', slug: 'tv-thiet-bi-giai-tri', stock: 8, rating: 4.8, reviews: 321 },
      { name: 'Apple TV 4K 2022', description: 'A15 Bionic, HDR10+, Siri Remote', price: 4990000, original_price: 5990000, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', slug: 'tv-thiet-bi-giai-tri', stock: 50, rating: 4.7, reviews: 654 },
      
      // Gaming
      { name: 'PlayStation 5 Slim', description: 'SSD 1TB, 4K 120Hz, DualSense', price: 13990000, original_price: 15990000, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', slug: 'thiet-bi-gaming', stock: 25, rating: 4.9, reviews: 2341 },
      { name: 'Xbox Series X', description: '12 TFLOPS, SSD 1TB, Quick Resume', price: 12990000, original_price: 14990000, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', slug: 'thiet-bi-gaming', stock: 20, rating: 4.8, reviews: 1876 },
      { name: 'Nintendo Switch OLED', description: 'Màn hình 7" OLED, 64GB, dock mới', price: 8490000, original_price: 9490000, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', slug: 'thiet-bi-gaming', stock: 40, rating: 4.7, reviews: 1543 },
      { name: 'Tay cầm PS5 DualSense', description: 'Haptic feedback, adaptive triggers', price: 1690000, original_price: 1990000, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', slug: 'thiet-bi-gaming', stock: 100, rating: 4.6, reviews: 987 },
      
      // Máy ảnh
      { name: 'Sony A7 IV', description: '33MP, 4K 60fps, AF 759 điểm', price: 59990000, original_price: 64990000, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', slug: 'may-anh', stock: 8, rating: 4.9, reviews: 432 },
      { name: 'Canon EOS R6 Mark II', description: '24MP, 4K 60fps, IBIS 8 stops', price: 54990000, original_price: 59990000, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', slug: 'may-anh', stock: 10, rating: 4.8, reviews: 321 },
      { name: 'Fujifilm X-T5', description: '40MP APS-C, film simulations, IBIS', price: 42990000, original_price: 46990000, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', slug: 'may-anh', stock: 12, rating: 4.7, reviews: 234 },
      { name: 'DJI Mini 4 Pro', description: '4K HDR, obstacle sensing, 34 min flight', price: 19990000, original_price: 22990000, image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400', slug: 'may-anh', stock: 15, rating: 4.8, reviews: 543 },
      
      // Loa & Âm thanh
      { name: 'HomePod 2nd Gen', description: 'Spatial Audio, room sensing, Siri', price: 7490000, original_price: 8490000, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400', slug: 'loa-am-thanh', stock: 30, rating: 4.6, reviews: 432 },
      { name: 'Sonos Era 300', description: 'Spatial Audio, Dolby Atmos, WiFi 6', price: 11990000, original_price: 13990000, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400', slug: 'loa-am-thanh', stock: 20, rating: 4.7, reviews: 321 },
      { name: 'Marshall Stanmore III', description: 'Classic design, 80W, Bluetooth 5.2', price: 9990000, original_price: 11990000, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400', slug: 'loa-am-thanh', stock: 25, rating: 4.8, reviews: 543 },
    ];

    // Check existing products
    const existingProducts = await client.query('SELECT name FROM products');
    const existingNames = existingProducts.rows.map(r => r.name.toLowerCase());

    let added = 0;
    for (const p of products) {
      if (!existingNames.includes(p.name.toLowerCase()) && catMap[p.slug]) {
        await client.query(
          `INSERT INTO products (name, description, price, original_price, image_url, category_id, stock, rating, review_count, is_featured) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [p.name, p.description, p.price, p.original_price, p.image, catMap[p.slug], p.stock, p.rating, p.reviews, Math.random() > 0.7]
        );
        added++;
      }
    }
    
    console.log(`✅ Added ${added} new products`);
  } catch (err) {
    console.error('❌ Error seeding products:', err.message);
  } finally {
    client.release();
  }
}
