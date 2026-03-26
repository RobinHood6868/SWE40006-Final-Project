import { jest } from '@jest/globals';
import request from 'supertest';

// Mock DB module before importing the app
jest.unstable_mockModule('../server/db.js', () => ({
  getPool: () => ({
    query: jest.fn().mockImplementation(async (query, params) => {
      // GET /db/status
      if (query === 'SELECT 1') return { rows: [{ '?column?': 1 }] };

      // GET /categories
      if (query.includes('FROM categories')) {
        return { rows: [
          { id: 1, name: 'Điện thoại', slug: 'dien-thoai', product_count: 5 },
          { id: 2, name: 'Laptop', slug: 'laptop', product_count: 2 }
        ]};
      }

      // GET /products/:id
      if (query.includes('FROM products') && query.includes('WHERE p.id = $1')) {
        if (params[0] === '1') return { rows: [{ id: 1, name: 'iPhone 15', price: 1000, category_name: 'Điện thoại' }] };
        if (params[0] === '999') return { rows: [] };
      }

      // GET /products with category filter
      if (query.includes('FROM products') && query.includes('slug = $')) {
        return { rows: [{ id: 1, name: 'iPhone 15', price: 1000, category_name: 'Điện thoại' }] };
      }

      // GET /products with search filter
      if (query.includes('FROM products') && query.includes('name ILIKE $')) {
        return { rows: [{ id: 2, name: 'MacBook', price: 2000, category_name: 'Laptop' }] };
      }

      // GET /products (all)
      if (query.includes('FROM products')) {
        return { rows: [
          { id: 1, name: 'iPhone 15', price: 1000, category_name: 'Điện thoại' },
          { id: 2, name: 'MacBook', price: 2000, category_name: 'Laptop' }
        ]};
      }

      // GET /orders/lookup - order
      if (query.includes('FROM orders WHERE id = $1')) {
        if (params[0] === '100') return { rows: [{ id: 100, guest_email: 'test@test.com', total: 1000, status: 'pending' }] };
        return { rows: [] };
      }
      // GET /orders/lookup - order items
      if (query.includes('FROM order_items oi JOIN products p')) {
        return { rows: [{ id: 1, product_id: 1, quantity: 1, price: 1000, name: 'iPhone 15' }] };
      }

      return { rows: [] };
    }),
    connect: jest.fn().mockResolvedValue({
      query: jest.fn().mockImplementation(async (query) => {
        if (query.includes('INSERT INTO orders')) return { rows: [{ id: 200 }] };
        return { rows: [] };
      }),
      release: jest.fn()
    })
  }),
  connectDB: jest.fn(),
  initDB: jest.fn()
}));

const { default: app } = await import('../server/app.js');

// ─── Test Suite ──────────────────────────────────────────────────────────────

describe('Volta Tech Store API', () => {

  // ─── API Response Format ──────────────────────────────────────────────────

  describe('API response format', () => {
    it('should return JSON content-type for all API endpoints', async () => {
      const res = await request(app).get('/api/products');
      expect(res.headers['content-type']).toMatch(/json/);
    });

    it('should not expose server technology via x-powered-by header', async () => {
      const res = await request(app).get('/api/products');
      expect(res.headers['x-powered-by']).toBeUndefined();
    });
  });

  // ─── Products ────────────────────────────────────────────────────────────

  describe('GET /api/products', () => {
    it('should return all products with correct structure', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      // Verify each product has required fields
      for (const product of res.body) {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('category_name');
      }
    });

    it('should filter products by category slug', async () => {
      const res = await request(app).get('/api/products?category=dien-thoai');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].category_name).toBe('Điện thoại');
    });

    it('should search products by name (case-insensitive)', async () => {
      const res = await request(app).get('/api/products?search=Mac');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].name).toContain('Mac');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return the correct product for a valid ID', async () => {
      const res = await request(app).get('/api/products/1');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
      expect(res.body.name).toBe('iPhone 15');
      expect(res.body).toHaveProperty('price');
      expect(res.body).toHaveProperty('category_name');
    });

    it('should return 404 with error message for non-existent ID', async () => {
      const res = await request(app).get('/api/products/999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ─── Categories ──────────────────────────────────────────────────────────

  describe('GET /api/categories', () => {
    it('should return all categories with product counts', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      // Verify each category has required fields
      for (const cat of res.body) {
        expect(cat).toHaveProperty('id');
        expect(cat).toHaveProperty('name');
        expect(cat).toHaveProperty('slug');
        expect(cat).toHaveProperty('product_count');
        expect(typeof cat.product_count).toBe('number');
      }
    });
  });

  // ─── Orders: Create ──────────────────────────────────────────────────────

  describe('POST /api/orders', () => {
    it('should create an order and return order_id on success', async () => {
      const res = await request(app).post('/api/orders').send({
        items: [{ product_id: 1, quantity: 1, price: 1000 }],
        guest_name: 'Nguyen Van A',
        guest_email: 'test@test.com',
        shipping_address: '123 Le Loi, HCMC',
        total: 1000
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.order_id).toBe('number');
    });

    it('should reject order with empty cart', async () => {
      const res = await request(app).post('/api/orders').send({
        items: [],
        guest_name: 'Test',
        shipping_address: '123 Test St'
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Giỏ hàng trống');
    });

    it('should reject order when guest_name is missing', async () => {
      const res = await request(app).post('/api/orders').send({
        items: [{ product_id: 1, quantity: 1, price: 1000 }],
        shipping_address: '123 Test St'
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Thiếu thông tin giao hàng');
    });

    it('should reject order when shipping_address is missing', async () => {
      const res = await request(app).post('/api/orders').send({
        items: [{ product_id: 1, quantity: 1, price: 1000 }],
        guest_name: 'Test'
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Thiếu thông tin giao hàng');
    });
  });

  // ─── Orders: Lookup ──────────────────────────────────────────────────────

  describe('GET /api/orders/lookup', () => {
    it('should return full order details with items for valid lookup', async () => {
      const res = await request(app).get('/api/orders/lookup?id=100&email=test@test.com');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(100);
      expect(res.body.guest_email).toBe('test@test.com');
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBeGreaterThan(0);
      expect(res.body.items[0]).toHaveProperty('name');
      expect(res.body.items[0]).toHaveProperty('price');
    });

    it('should return 400 when email is missing from lookup', async () => {
      const res = await request(app).get('/api/orders/lookup?id=100');
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Cần mã đơn và email');
    });

    it('should return 400 when order ID is missing', async () => {
      const res = await request(app).get('/api/orders/lookup?email=test@test.com');
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Cần mã đơn và email');
    });
  });
});
