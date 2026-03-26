import { getPool } from './db.js';

export async function fixProductImages() {
  const client = await getPool().connect();
  try {
    // Image mapping for products
    const imageMap = {
      'iPhone': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
      'Samsung Galaxy S': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
      'MacBook': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
      'Dell': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
      'AirPods': 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80',
      'Sony WH': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      'Apple Watch': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80',
      'Galaxy Watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      'MagSafe': 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&q=80',
      'Ốp lưng': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80',
      'Cáp': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80',
      'Xiaomi': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
      'iPad': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
      'PlayStation': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80',
      'Xbox': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80',
      'Nintendo': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80',
      'Sony A7': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
      'Canon': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
      'HomePod': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80',
      'Sonos': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80',
      'Anker': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80',
      'Logitech': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
      'Asus': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
      'HP': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
      'Lenovo': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
      'Google Pixel': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
      'OPPO': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
      'Jabra': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80',
      'Sennheiser': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80',
      'Garmin': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80',
      'LG OLED': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80',
      'Samsung QN': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80',
      'Apple TV': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80',
      'Fujifilm': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
      'DJI': 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=600&q=80',
      'Marshall': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80',
      'Keychron': 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80',
      'Màn hình': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
    };

    let updated = 0;
    
    for (const [keyword, imageUrl] of Object.entries(imageMap)) {
      const result = await client.query(
        `UPDATE products SET image_url = $1 WHERE name ILIKE $2 AND image_url NOT LIKE '%w=600%'`,
        [imageUrl, `%${keyword}%`]
      );
      updated += result.rowCount;
    }

    // Update products with NULL or empty image_url
    const defaultImage = 'https://images.unsplash.com/photo-1560393464-5c69a71c57a3?w=600&q=80';
    const nullResult = await client.query(
      `UPDATE products SET image_url = $1 WHERE image_url IS NULL OR image_url = ''`,
      [defaultImage]
    );
    
    console.log(`✅ Updated ${updated} products with new images`);
    console.log(`✅ Updated ${nullResult.rowCount} products with missing images`);
  } catch (err) {
    console.error('❌ Error updating images:', err.message);
  } finally {
    client.release();
  }
}
