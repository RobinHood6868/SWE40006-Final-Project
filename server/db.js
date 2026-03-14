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
      ssl: { rejectUnauthorized: false }
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
          ('iPhone 15 Pro Max', 'Chip A17 Pro mạnh mẽ, camera 48MP chuyên nghiệp, titanium cao cấp', 34990000, 38990000, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 1, 50, 4.9, 2341, true),
          ('Samsung Galaxy S24 Ultra', 'Bút S Pen tích hợp, AI Galaxy, camera 200MP', 29990000, 33990000, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', 1, 35, 4.8, 1876, true),
          ('MacBook Pro M3 14"', 'Chip M3 mạnh mẽ, màn hình Liquid Retina XDR, pin 22 giờ', 52990000, 57990000, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 2, 20, 4.9, 987, true),
          ('Dell XPS 15 OLED', 'Màn OLED 3.5K sắc nét, Intel Core i9, RTX 4060', 48990000, 54990000, 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', 2, 15, 4.7, 654, false),
          ('AirPods Pro 2nd Gen', 'ANC chủ động, âm thanh không gian, chip H2', 6990000, 7990000, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400', 4, 100, 4.8, 4521, true),
          ('Sony WH-1000XM5', 'Chống ồn hàng đầu, 30 giờ pin, LDAC Hi-Res', 8490000, 9990000, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 4, 45, 4.9, 3210, false),
          ('Apple Watch Series 9', 'Double tap gesture, màn hình sáng hơn, sạc nhanh', 12990000, 14990000, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', 5, 60, 4.7, 1543, true),
          ('MagSafe Charger 15W', 'Sạc không dây nhanh 15W cho iPhone', 890000, 1190000, 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400', 3, 200, 4.5, 876, false),
          ('Ốp lưng iPhone 15 Pro', 'Chất liệu silicon cao cấp, chống sốc 4 góc', 390000, 590000, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400', 3, 300, 4.3, 432, false),
          ('Samsung Galaxy Watch 6', 'Theo dõi sức khoẻ toàn diện, BioActive Sensor', 8490000, 9990000, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 5, 40, 4.6, 765, false),
          ('Cáp USB-C 2m Anker', 'Sạc nhanh 100W, truyền dữ liệu 480Mbps', 290000, 390000, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', 3, 500, 4.4, 2100, false),
          ('Xiaomi 14 Ultra', 'Camera Leica f/1.63, Snapdragon 8 Gen 3, 90W HyperCharge', 24990000, 28990000, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 1, 25, 4.7, 543, false);
      `);
    }
  } finally {
    client.release();
  }
}