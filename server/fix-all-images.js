import { getPool } from './db.js';

export async function fixAllProductImages() {
  const client = await getPool().connect();
  try {
    console.log('🔄 Starting comprehensive image update...\n');
    
    // Get all products
    const result = await client.query('SELECT id, name FROM products ORDER BY id');
    const products = result.rows;
    
    console.log(`📦 Found ${products.length} products in database\n`);
    
    // Image mapping - comprehensive list
    const getImageUrl = (productName) => {
      const name = productName.toLowerCase();
      
      // Phones
      if (name.includes('iphone 15 pro')) return 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80';
      if (name.includes('iphone 15')) return 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80';
      if (name.includes('iphone 14 pro')) return 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&q=80';
      if (name.includes('iphone')) return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80';
      if (name.includes('galaxy z flip')) return 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=600&q=80';
      if (name.includes('galaxy z fold')) return 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=600&q=80';
      if (name.includes('galaxy s24') || name.includes('galaxy s23')) return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80';
      if (name.includes('galaxy') && name.includes('phone')) return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80';
      if (name.includes('pixel 8') || name.includes('pixel 7')) return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80';
      if (name.includes('xiaomi')) return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80';
      if (name.includes('oppo')) return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80';
      
      // Laptops
      if (name.includes('macbook pro')) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80';
      if (name.includes('macbook air')) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80';
      if (name.includes('macbook')) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80';
      if (name.includes('dell xps')) return 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80';
      if (name.includes('asus rog') || name.includes('zephyrus')) return 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80';
      if (name.includes('hp spectre')) return 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80';
      if (name.includes('thinkpad')) return 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80';
      if (name.includes('laptop')) return 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80';
      
      // Tablets
      if (name.includes('ipad pro')) return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80';
      if (name.includes('ipad air')) return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80';
      if (name.includes('ipad')) return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80';
      if (name.includes('galaxy tab')) return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80';
      if (name.includes('tablet')) return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80';
      
      // Headphones
      if (name.includes('airpods pro')) return 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80';
      if (name.includes('airpods max')) return 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80';
      if (name.includes('airpods')) return 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80';
      if (name.includes('sony wh-1000')) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80';
      if (name.includes('sony')) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80';
      if (name.includes('galaxy buds')) return 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80';
      if (name.includes('jabra')) return 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80';
      if (name.includes('sennheiser')) return 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80';
      if (name.includes('headphone')) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80';
      
      // Smartwatches
      if (name.includes('apple watch')) return 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80';
      if (name.includes('galaxy watch')) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
      if (name.includes('garmin')) return 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80';
      if (name.includes('watch')) return 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80';
      
      // Gaming
      if (name.includes('playstation') || name.includes('ps5')) return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80';
      if (name.includes('xbox')) return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80';
      if (name.includes('nintendo switch') || name.includes('switch oled')) return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80';
      if (name.includes('dualsense')) return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80';
      if (name.includes('gaming')) return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80';
      
      // Cameras
      if (name.includes('sony a7') || name.includes('alpha')) return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80';
      if (name.includes('canon eos') || name.includes('canon r6')) return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80';
      if (name.includes('fujifilm')) return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80';
      if (name.includes('dji') || name.includes('drone')) return 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=600&q=80';
      if (name.includes('camera')) return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80';
      
      // TV & Audio
      if (name.includes('lg oled')) return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80';
      if (name.includes('samsung qn')) return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80';
      if (name.includes('apple tv')) return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80';
      if (name.includes('tv')) return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80';
      if (name.includes('homepod')) return 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80';
      if (name.includes('sonos')) return 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80';
      if (name.includes('marshall')) return 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80';
      if (name.includes('speaker') || name.includes('loa')) return 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80';
      
      // Accessories
      if (name.includes('anker')) return 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80';
      if (name.includes('logitech') || name.includes('mx master')) return 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80';
      if (name.includes('keychron')) return 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80';
      if (name.includes('màn hình') || name.includes('monitor')) return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80';
      if (name.includes('ốp lưng') || name.includes('case')) return 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80';
      if (name.includes('magsafe')) return 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&q=80';
      if (name.includes('cáp') || name.includes('cable') || name.includes('usb')) return 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80';
      if (name.includes('phụ kiện') || name.includes('accessory')) return 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80';
      
      // Default placeholder
      return 'https://images.unsplash.com/photo-1560393464-5c69a71c57a3?w=600&q=80';
    };
    
    let updated = 0;
    let errors = 0;
    
    for (const product of products) {
      try {
        const imageUrl = getImageUrl(product.name);
        await client.query(
          'UPDATE products SET image_url = $1 WHERE id = $2',
          [imageUrl, product.id]
        );
        updated++;
        console.log(`✅ ${product.name}`);
      } catch (err) {
        errors++;
        console.error(`❌ ${product.name}: ${err.message}`);
      }
    }
    
    console.log(`\n✅ Successfully updated ${updated}/${products.length} products`);
    if (errors > 0) {
      console.log(`❌ ${errors} products failed to update`);
    }
  } catch (err) {
    console.error('❌ Fatal error:', err.message);
  } finally {
    client.release();
  }
}
