import pg from 'pg';
const { Pool } = pg;

let pool = null;

export function getPool() {
  if (!pool) {
    throw new Error('Database not connected');
  }
  return pool;
}

export async function connectDB(connectionString) {
  try {
    if (pool) {
      await pool.end();
    }
    pool = new Pool({
      connectionString,
      ssl: true
    });
    await pool.query('SET search_path TO public');
    return true;
  } catch (err) {
    pool = null;
    throw err;
  }
}

export async function initDB() {
  const client = await getPool().connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        image_url TEXT,
        category_id INT REFERENCES categories(id),
        stock INT DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0,
        review_count INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        guest_name VARCHAR(255),
        guest_email VARCHAR(255),
        guest_phone VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        total DECIMAL(10,2) NOT NULL,
        shipping_address TEXT,
        note TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(id),
        product_id INT REFERENCES products(id),
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL
      );
    `);

    // Seed sample data
    const catCount = await client.query('SELECT COUNT(*) FROM categories');
    if (parseInt(catCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO categories (name, slug) VALUES
          ('Điện thoại', 'dien-thoai'),
          ('Laptop', 'laptop'),
          ('Phụ kiện', 'phu-kien'),
          ('Tai nghe', 'tai-nghe'),
          ('Đồng hồ thông minh', 'dong-ho-thong-minh');
      `);

      await client.query(`
        INSERT INTO products (name, description, price, original_price, image_url, category_id, stock, rating, review_count, is_featured) VALUES
          ('iPhone 15 Pro Max', '<h3 class="text-lg font-bold mb-3">Tổng quan</h3><p class="mb-4">iPhone 15 Pro Max là chiếc iPhone mạnh mẽ nhất từ Apple với khung titanium cao cấp, chip A17 Pro đột phá và hệ thống camera Pro 48MP.</p><h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3><ul class="list-disc pl-5 space-y-2 mb-4"><li><strong>Màn hình:</strong> Super Retina XDR 6.7", 2796×1290, ProMotion 120Hz</li><li><strong>Chip:</strong> Apple A17 Pro 3nm, CPU 6 nhân, GPU 6 nhân</li><li><strong>RAM:</strong> 8GB</li><li><strong>Bộ nhớ:</strong> 256GB/512GB/1TB</li><li><strong>Camera:</strong> 48MP chính + 12MP tele 5x + 12MP ultra wide</li><li><strong>Pin:</strong> 4422mAh, sạc nhanh 27W, MagSafe 15W</li></ul>', 34990000, 38990000, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80', 1, 50, 4.9, 2341, true),
          ('Samsung Galaxy S24 Ultra', '<h3 class="text-lg font-bold mb-3">Tổng quan</h3><p class="mb-4">Galaxy S24 Ultra mang đến trải nghiệm AI đột phá với Galaxy AI, camera 200MP và bút S Pen tích hợp.</p><h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3><ul class="list-disc pl-5 space-y-2 mb-4"><li><strong>Màn hình:</strong> Dynamic AMOLED 2X 6.8", QHD+ 120Hz</li><li><strong>Chip:</strong> Snapdragon 8 Gen 3 for Galaxy</li><li><strong>RAM:</strong> 12GB LPDDR5X</li><li><strong>Bộ nhớ:</strong> 256GB/512GB/1TB</li><li><strong>Camera:</strong> 200MP + 50MP 5x + 10MP 3x + 12MP ultra wide</li><li><strong>Pin:</strong> 5000mAh, sạc nhanh 45W</li></ul>', 29990000, 33990000, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80', 1, 35, 4.8, 1876, true),
          ('MacBook Pro M3 14"', '<h3 class="text-lg font-bold mb-3">Tổng quan</h3><p class="mb-4">MacBook Pro 14" với chip M3 Pro mang hiệu năng đột phá cho chuyên gia sáng tạo.</p><h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3><ul class="list-disc pl-5 space-y-2 mb-4"><li><strong>Màn hình:</strong> Liquid Retina XDR 14.2", 3024×1964, 120Hz</li><li><strong>Chip:</strong> Apple M3 Pro, CPU 12 nhân, GPU 18 nhân</li><li><strong>RAM:</strong> 18GB Unified</li><li><strong>SSD:</strong> 512GB</li><li><strong>Pin:</strong> Lên đến 22 giờ</li></ul>', 52990000, 57990000, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', 2, 20, 4.9, 987, true),
          ('Dell XPS 15 OLED', '<h3 class="text-lg font-bold mb-3">Tổng quan</h3><p class="mb-4">Dell XPS 15 OLED với màn hình 3.5K OLED stunning, Intel Core i9 và RTX 4060.</p><h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3><ul class="list-disc pl-5 space-y-2 mb-4"><li><strong>Màn hình:</strong> 15.6" OLED 3.5K, 400 nits, 100% DCI-P3</li><li><strong>Chip:</strong> Intel Core i9-13900H</li><li><strong>RAM:</strong> 32GB DDR5</li><li><strong>SSD:</strong> 1TB NVMe</li><li><strong>GPU:</strong> NVIDIA RTX 4060 8GB</li></ul>', 48990000, 54990000, 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80', 2, 15, 4.7, 654, false),
          ('AirPods Pro 2nd Gen', '<h3 class="text-lg font-bold mb-3">Tổng quan</h3><p class="mb-4">AirPods Pro thế hệ 2 với chip H2, ANC chủ động gấp 2 lần.</p><h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3><ul class="list-disc pl-5 space-y-2 mb-4"><li><strong>Chip:</strong> Apple H2</li><li><strong>ANC:</strong> Chủ động, gấp 2 lần thế hệ 1</li><li><strong>Pin:</strong> 6 giờ (ANC on), 30 giờ với case</li><li><strong>Kết nối:</strong> Bluetooth 5.3</li><li><strong>Chống nước:</strong> IPX4</li></ul>', 6990000, 7990000, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80', 4, 100, 4.8, 4521, true),
          ('Sony WH-1000XM5', '<h3 class="text-lg font-bold mb-3">Tổng quan</h3><p class="mb-4">WH-1000XM5 - Tai nghe chống ồn hàng đầu với 8 microphones và 30 giờ pin.</p><h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3><ul class="list-disc pl-5 space-y-2 mb-4"><li><strong>Driver:</strong> 30mm carbon fiber</li><li><strong>ANC:</strong> 8 microphones, chip V1</li><li><strong>Pin:</strong> 30 giờ (ANC on)</li><li><strong>Kết nối:</strong> Bluetooth 5.2, LDAC</li><li><strong>Cân nặng:</strong> 250g</li></ul>', 8490000, 9990000, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', 4, 45, 4.9, 3210, false),
          ('Apple Watch Series 9', '<h3 class="text-lg font-bold mb-3">Tổng quan</h3><p class="mb-4">Apple Watch Series 9 với chip S9, Double Tap gesture.</p><h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3><ul class="list-disc pl-5 space-y-2 mb-4"><li><strong>Màn hình:</strong> Always-On Retina, 1000 nits</li><li><strong>Chip:</strong> S9 SiP</li><li><strong>Cảm biến:</strong> Nhịp tim, ECG, SpO2, nhiệt độ</li><li><strong>Pin:</strong> 18 giờ</li><li><strong>Chống nước:</strong> 50m</li></ul>', 12990000, 14990000, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80', 5, 60, 4.7, 1543, true),
          ('MagSafe Charger 15W', '<h3 class="text-lg font-bold mb-3">Tổng quan</h3><p class="mb-4">Sạc không dây MagSafe 15W cho iPhone.</p><h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3><ul class="list-disc pl-5 space-y-2 mb-4"><li><strong>Công suất:</strong> 15W Max</li><li><strong>Tương thích:</strong> iPhone 12/13/14/15 series</li><li><strong>Kết nối:</strong> USB-C</li><li><strong>Cáp:</strong> 1m included</li></ul>', 890000, 1190000, 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&q=80', 3, 200, 4.5, 876, false),
          ('Ốp lưng iPhone 15 Pro', '<h3 class="text-lg font-bold mb-3">Tổng quan</h3><p class="mb-4">Ốp lưng silicon cao cấp cho iPhone 15 Pro.</p><h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3><ul class="list-disc pl-5 space-y-2 mb-4"><li><strong>Chất liệu:</strong> Silicon cao cấp</li><li><strong>Tương thích:</strong> iPhone 15 Pro</li><li><strong>Tính năng:</strong> Chống sốc, MagSafe</li></ul>', 390000, 590000, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80', 3, 300, 4.3, 432, false),
          ('Samsung Galaxy Watch 6', '<h3 class="text-lg font-bold mb-3">Tổng quan</h3><p class="mb-4">Galaxy Watch 6 với theo dõi sức khỏe toàn diện.</p><h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3><ul class="list-disc pl-5 space-y-2 mb-4"><li><strong>Màn hình:</strong> Super AMOLED 1.5"</li><li><strong>Cảm biến:</strong> BioActive (HR, ECG, BIA)</li><li><strong>Pin:</strong> 425mAh</li><li><strong>Chống nước:</strong> 5ATM + IP68</li></ul>', 8490000, 9990000, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', 5, 40, 4.6, 765, false),
          ('Cáp USB-C 2m Anker', '<h3 class="text-lg font-bold mb-3">Tổng quan</h3><p class="mb-4">Cáp USB-C 2m Anker sạc nhanh 100W.</p><h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3><ul class="list-disc pl-5 space-y-2 mb-4"><li><strong>Độ dài:</strong> 2m</li><li><strong>Công suất:</strong> 100W (20V/5A)</li><li><strong>Dữ liệu:</strong> 480Mbps</li><li><strong>Tương thích:</strong> USB-C devices</li></ul>', 290000, 390000, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80', 3, 500, 4.4, 2100, false),
          ('Xiaomi 14 Ultra', '<h3 class="text-lg font-bold mb-3">Tổng quan</h3><p class="mb-4">Xiaomi 14 Ultra với camera Leica f/1.63.</p><h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3><ul class="list-disc pl-5 space-y-2 mb-4"><li><strong>Màn hình:</strong> AMOLED 6.73", 120Hz</li><li><strong>Chip:</strong> Snapdragon 8 Gen 3</li><li><strong>Camera:</strong> Leica 50MP 1", 90W sạc nhanh</li><li><strong>Pin:</strong> 5000mAh</li></ul>', 24990000, 28990000, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', 1, 25, 4.7, 543, false);
      `);
    }
  } finally {
    client.release();
  }
}