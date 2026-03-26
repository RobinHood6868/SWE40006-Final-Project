import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import path from 'path';
import { connectDB, initDB } from './db.js';
import { seedMoreProducts } from './seed.js';
import app from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env nếu có (không cần cài dotenv)
try {
  const env = readFileSync(path.join(__dirname, '../.env'), 'utf8');
  for (const line of env.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx > 0) {
      const k = trimmed.slice(0, idx).trim();
      const v = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      process.env[k] = v;
    }
  }
} catch { }

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
  if (process.env.DATABASE_URL) {
    try {
      await connectDB(process.env.DATABASE_URL);
      await initDB();
      console.log('✅ Neon DB kết nối tự động từ .env');
      // Seed more products
      await seedMoreProducts();
      console.log('✅ Đã thêm sản phẩm mới vào database');
    } catch (e) {
      console.error('❌ Kết nối DB thất bại:', e.message);
    }
  } else {
    console.log('💡 Thêm DATABASE_URL vào .env để tự kết nối khi khởi động');
  }
});