import express from 'express';
import { getPool } from './db.js';

const router = express.Router();

// Xoá router /db/connect để bảo mật - Point 4 trong audit report

router.get('/db/status', (req, res) => {
  try { getPool(); res.json({ connected: true }); }
  catch { res.json({ connected: false }); }
});

router.get('/products', async (req, res) => {
  try {
    const pool = getPool();
    const { category, search, min_price, max_price, rating, in_stock, sort } = req.query;
    let query = `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
    const params = [];
    
    if (category) { params.push(category); query += ` AND c.slug = $${params.length}`; }
    if (search) { params.push(`%${search}%`); query += ` AND p.name ILIKE $${params.length}`; }
    if (min_price) { params.push(Number(min_price)); query += ` AND p.price >= $${params.length}`; }
    if (max_price) { params.push(Number(max_price)); query += ` AND p.price <= $${params.length}`; }
    if (rating) { params.push(Number(rating)); query += ` AND p.rating >= $${params.length}`; }
    if (in_stock === 'true') { query += ` AND p.stock > 0`; }
    
    // Sorting
    let orderBy = 'p.is_featured DESC, p.created_at DESC';
    if (sort) {
      switch (sort) {
        case 'price-asc': orderBy = 'p.price ASC, p.id ASC'; break;
        case 'price-desc': orderBy = 'p.price DESC, p.id ASC'; break;
        case 'rating': orderBy = 'p.rating DESC, p.review_count DESC, p.id ASC'; break;
        case 'newest': orderBy = 'p.created_at DESC, p.id ASC'; break;
        case 'best-selling': orderBy = 'p.review_count DESC, p.rating DESC, p.id ASC'; break;
        default: orderBy = 'p.is_featured DESC, p.created_at DESC';
      }
    }
    query += ` ORDER BY ${orderBy}`;
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/products/:id', async (req, res) => {
  try {
    const pool = getPool();
    const r = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/categories', async (req, res) => {
  try {
    const pool = getPool();
    const r = await pool.query(`SELECT c.*, COUNT(p.id)::int as product_count FROM categories c LEFT JOIN products p ON c.id = p.category_id GROUP BY c.id ORDER BY c.name`);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/orders', async (req, res) => {
  const { items, guest_name, guest_email, guest_phone, shipping_address, note, total } = req.body;
  if (!items || !items.length) return res.status(400).json({ error: 'Giỏ hàng trống' });
  if (!guest_name || !shipping_address) return res.status(400).json({ error: 'Thiếu thông tin giao hàng' });
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const orderRes = await client.query(
      `INSERT INTO orders (guest_name, guest_email, guest_phone, shipping_address, note, total) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [guest_name, guest_email || null, guest_phone || null, shipping_address, note || null, total]
    );
    const order = orderRes.rows[0];
    for (const item of items) {
      await client.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)', [order.id, item.product_id, item.quantity, item.price]);
    }
    await client.query('COMMIT');
    res.json({ success: true, order_id: order.id });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally { client.release(); }
});

router.get('/orders/lookup', async (req, res) => {
  const { id, email } = req.query;
  if (!id || !email) return res.status(400).json({ error: 'Cần mã đơn và email' });
  try {
    const pool = getPool();
    const r = await pool.query('SELECT * FROM orders WHERE id = $1 AND guest_email = $2', [id, email]);
    if (!r.rows.length) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    const order = r.rows[0];
    const items = await pool.query(`SELECT oi.*, p.name, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1`, [order.id]);
    res.json({ ...order, items: items.rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
