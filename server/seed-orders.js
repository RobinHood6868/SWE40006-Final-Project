import { connectDB, getPool } from './db.js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env variables
try {
  const env = readFileSync(path.join(__dirname, '../.env'), 'utf8');
  for (const line of env.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx > 0) {
      const k = trimmed.slice(0, idx).trim();
      const v = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[k]) process.env[k] = v;
    }
  }
} catch { }

const FIRST_NAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng'];
const MIDDLE_NAMES = ['Văn', 'Thị', 'Hoàng', 'Minh', 'Ngọc', 'Hữu', 'Đức', 'Thanh', 'Quang'];
const LAST_NAMES = ['Anh', 'Bình', 'Cường', 'Dũng', 'Hải', 'Hương', 'Khoa', 'Lan', 'Nam', 'Tâm', 'Long', 'Linh'];
const CITIES = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Nha Trang'];
const STREETS = ['Lê Lợi', 'Nguyễn Huệ', 'Trần Hưng Đạo', 'Hai Bà Trưng', 'Lý Thường Kiệt', 'Ba Tháng Hai'];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randItem(arr) {
  return arr[randInt(0, arr.length - 1)];
}

async function run() {
  console.log('🌱 Starting Order Data Generator...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env.');
    process.exit(1);
  }

  await connectDB(process.env.DATABASE_URL);
  const pool = getPool();

  try {
    // 0. Fix the schema to allow large Vietnamese currency values (> 99 million VND)
    await pool.query('ALTER TABLE order_items ALTER COLUMN price TYPE NUMERIC(15, 2)');
    await pool.query('ALTER TABLE orders ALTER COLUMN total TYPE NUMERIC(15, 2)');

    // 1. Get all valid products to generate real order items
    const prodRes = await pool.query('SELECT id, price FROM products');
    if (prodRes.rows.length === 0) {
      console.error('❌ No products found in the database. Add products before generating orders.');
      process.exit(1);
    }
    const products = prodRes.rows;

    const NUM_ORDERS = 35;
    let totalRevenue = 0;

    console.log(`\nGenerating ${NUM_ORDERS} realistic orders...`);

    for (let i = 0; i < NUM_ORDERS; i++) {
      // Generate realistic Vietnamese customer data
      const name = `${randItem(FIRST_NAMES)} ${randItem(MIDDLE_NAMES)} ${randItem(LAST_NAMES)}`;
      const email = `${name.split(' ').pop().toLowerCase()}${randInt(10, 99)}@gmail.com`;
      const phone = `09${randInt(10000000, 99999999)}`;
      const address = `Số ${randInt(1, 200)}, ${randItem(STREETS)}, Quận ${randInt(1, 10)}, TP. ${randItem(CITIES)}`;
      
      const isCompleted = Math.random() > 0.2; // 80% completed
      const status = isCompleted ? 'completed' : (Math.random() > 0.5 ? 'pending' : 'cancelled');
      
      const orderDate = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()); // Last 30 days

      // Insert blank order to get ID first
      const orderRes = await pool.query(
        `INSERT INTO orders (guest_name, guest_email, guest_phone, status, total, shipping_address, created_at)
         VALUES ($1, $2, $3, $4, 0, $5, $6) RETURNING id`,
        [name, email, phone, status, address, orderDate]
      );
      const orderId = orderRes.rows[0].id;

      // Generate 1 to 4 order items
      const numItems = randInt(1, 4);
      let orderTotal = 0;

      for (let j = 0; j < numItems; j++) {
        const product = randItem(products);
        const qty = randInt(1, 2); // 1 or 2 of the same item
        const itemTotal = Number(product.price) * qty;
        orderTotal += itemTotal;

        await pool.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [orderId, product.id, qty, product.price]
        );
      }

      // Update the Order's total
      await pool.query(
        `UPDATE orders SET total = $1 WHERE id = $2`,
        [orderTotal, orderId]
      );

      if (status === 'completed') totalRevenue += orderTotal;
      
      if ((i + 1) % 5 === 0) console.log(`✅ Generated ${i + 1}/${NUM_ORDERS} orders.`);
    }

    const fmt = n => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
    console.log(`\n🎉 Success! Added ${NUM_ORDERS} orders.`);
    console.log(`💰 New Revenue Generated: ${fmt(totalRevenue)}`);
    console.log(`(You can run this script multiple times to keep boosting revenue)`);

  } catch (err) {
    console.error('❌ Database error:', err);
  } finally {
    process.exit(0);
  }
}

run();
