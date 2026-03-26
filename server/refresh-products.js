import { getPool } from './db.js';

export async function refreshProducts() {
  const client = await getPool().connect();
  try {
    console.log('🗑️  Clearing old products...\n');
    
    // Delete all order_items first (foreign key constraint)
    await client.query('DELETE FROM order_items');
    console.log('✅ Cleared order_items');
    
    // Delete all orders (foreign key constraint)
    await client.query('DELETE FROM orders');
    console.log('✅ Cleared orders');
    
    // Delete all products
    const result = await client.query('DELETE FROM products');
    console.log(`✅ Deleted ${result.rowCount} old products\n`);
    
    // Keep categories (they're still valid)
    console.log('📦 Keeping existing categories...\n');
    
    console.log('✨ Database ready for fresh product seed!\n');
    console.log('👉 Restart server to run seedMoreProducts() and fixAllProductImages()');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    client.release();
  }
}
