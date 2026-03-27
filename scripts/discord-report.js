/**
 * Discord Deployment Report Script
 * 
 * Runs after PM2 restart during CI/CD deployment.
 * Inserts a demo order, queries revenue metrics, and sends
 * a rich embed to a Discord webhook.
 * 
 * Usage: DISCORD_WEBHOOK_URL=<url> node scripts/discord-report.js
 */

import { connectDB, getPool } from '../server/db.js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env
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

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!WEBHOOK_URL) {
  console.log('⚠️  DISCORD_WEBHOOK_URL not set, skipping Discord report.');
  process.exit(0);
}

async function main() {
  try {
    // Connect to database
    await connectDB(process.env.DATABASE_URL);
    const pool = getPool();

    // Insert a demo order for presentation
    const demoOrder = await pool.query(
      `INSERT INTO orders (guest_name, guest_email, shipping_address, total, status)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING
       RETURNING id`,
      ['CI/CD Demo', 'demo@volta.vn', 'Auto-deployed via GitHub Actions', 0, 'completed']
    );

    const demoId = demoOrder.rows[0]?.id || 'N/A';
    console.log(`📦 Demo order inserted: #${demoId}`);

    // Query metrics
    const revenue = await pool.query(
      `SELECT COALESCE(SUM(total), 0) as total_revenue, COUNT(*) as order_count FROM orders`
    );

    const { total_revenue, order_count } = revenue.rows[0];
    const fmt = n => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

    // Build Discord embed
    const embed = {
      embeds: [{
        title: '🚀 Volta Tech Store — Deployment Report',
        color: 0x2563eb,
        fields: [
          { name: '📊 Total Revenue', value: fmt(total_revenue), inline: true },
          { name: '📦 Total Orders', value: `${order_count}`, inline: true },
          { name: '🆔 Latest Demo Order', value: `#${demoId}`, inline: true },
          { name: '⚙️ Pipeline', value: 'GitHub Actions → AWS EC2', inline: true },
          { name: '🖥️ Process Manager', value: 'PM2', inline: true },
          { name: '🔄 Trigger', value: 'Push to `main`', inline: true }
        ],
        footer: { text: 'Volta Tech Store CI/CD Pipeline' },
        timestamp: new Date().toISOString()
      }]
    };

    // Send to Discord
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed)
    });

    if (res.ok) {
      console.log('✅ Discord report sent successfully!');
    } else {
      console.error(`❌ Discord responded with ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.error('❌ Discord report failed:', err.message);
  }

  process.exit(0);
}

main();
