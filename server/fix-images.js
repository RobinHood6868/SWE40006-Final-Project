import { getPool } from './db.js';

export async function fixProductImages() {
  const client = await getPool().connect();
  try {
    // Image mapping for products - more specific patterns first
    const imageMap = [
      { pattern: 'iPhone 15 Pro', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80' },
      { pattern: 'iPhone 15', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80' },
      { pattern: 'iPhone 14 Pro', url: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&q=80' },
      { pattern: 'Galaxy Z Flip', url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=600&q=80' },
      { pattern: 'Galaxy Z Fold', url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=600&q=80' },
      { pattern: 'Galaxy S24', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80' },
      { pattern: 'Galaxy S23', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80' },
      { pattern: 'Galaxy Tab', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80' },
      { pattern: 'Galaxy Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
      { pattern: 'Pixel 8', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80' },
      { pattern: 'Pixel 7', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80' },
      { pattern: 'MacBook Pro', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80' },
      { pattern: 'MacBook Air', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80' },
      { pattern: 'Dell XPS', url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80' },
      { pattern: 'Asus ROG', url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80' },
      { pattern: 'HP Spectre', url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80' },
      { pattern: 'ThinkPad', url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80' },
      { pattern: 'iPad Pro', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80' },
      { pattern: 'iPad Air', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80' },
      { pattern: 'AirPods Pro', url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80' },
      { pattern: 'AirPods Max', url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80' },
      { pattern: 'Sony WH', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
      { pattern: 'Sony A7', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80' },
      { pattern: 'Canon EOS', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80' },
      { pattern: 'Fujifilm X', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80' },
      { pattern: 'Apple Watch', url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80' },
      { pattern: 'Galaxy Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
      { pattern: 'Garmin Fenix', url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80' },
      { pattern: 'PlayStation', url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80' },
      { pattern: 'Xbox Series', url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80' },
      { pattern: 'Nintendo Switch', url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80' },
      { pattern: 'DualSense', url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80' },
      { pattern: 'HomePod', url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80' },
      { pattern: 'Sonos Era', url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80' },
      { pattern: 'Marshall Stanmore', url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80' },
      { pattern: 'Jabra Elite', url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80' },
      { pattern: 'Sennheiser Momentum', url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80' },
      { pattern: 'Samsung Galaxy Buds', url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80' },
      { pattern: 'LG OLED', url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80' },
      { pattern: 'Samsung QN', url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80' },
      { pattern: 'Apple TV', url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80' },
      { pattern: 'DJI Mini', url: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=600&q=80' },
      { pattern: 'Anker', url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80' },
      { pattern: 'Logitech MX', url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80' },
      { pattern: 'Keychron', url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80' },
      { pattern: 'Màn hình', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80' },
      { pattern: 'Ốp lưng', url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80' },
      { pattern: 'MagSafe', url: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&q=80' },
      { pattern: 'Cáp USB', url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80' },
      { pattern: 'Xiaomi', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' },
      { pattern: 'OPPO Find', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' },
    ];

    let totalUpdated = 0;
    
    for (const { pattern, url } of imageMap) {
      const result = await client.query(
        `UPDATE products SET image_url = $1 WHERE name ILIKE $2 AND (image_url IS NULL OR image_url LIKE '%w=400%' OR image_url = 'https://images.unsplash.com/photo-1560393464-5c69a71c57a3?w=400&q=80')`,
        [url, `%${pattern}%`]
      );
      if (result.rowCount > 0) {
        console.log(`  ✅ Updated ${result.rowCount} products matching "${pattern}"`);
        totalUpdated += result.rowCount;
      }
    }

    // Update any remaining products with NULL or placeholder image
    const defaultImage = 'https://images.unsplash.com/photo-1560393464-5c69a71c57a3?w=600&q=80';
    const nullResult = await client.query(
      `UPDATE products SET image_url = $1 WHERE image_url IS NULL OR image_url = '' OR image_url LIKE '%w=400%'`,
      [defaultImage]
    );
    
    console.log(`\n✅ Total: Updated ${totalUpdated + nullResult.rowCount} products with new images`);
  } catch (err) {
    console.error('❌ Error updating images:', err.message);
  } finally {
    client.release();
  }
}
