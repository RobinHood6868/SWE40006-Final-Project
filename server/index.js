import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import routes from './routes.js';
import { connectDB, initDB } from './db.js';

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

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, async () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
  if (process.env.DATABASE_URL) {
    try {
      await connectDB(process.env.DATABASE_URL);
      await initDB();
      console.log('✅ Neon DB kết nối tự động từ .env');
    } catch (e) {
      console.error('❌ Kết nối DB thất bại:', e.message);
    }
  } else {
    console.log('💡 Thêm DATABASE_URL vào .env để tự kết nối khi khởi động');
  }
});