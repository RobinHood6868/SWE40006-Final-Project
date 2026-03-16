import { jest } from '@jest/globals';
import request from 'supertest';

// Mock DB module before importing the app
jest.unstable_mockModule('../server/db.js', () => ({
  getPool: () => ({
    query: jest.fn().mockImplementation(async (query, params) => {
      // 1. GET /db/status
      if (query === 'SELECT 1') return { rows: [{ '?column?': 1 }] };
      
      // 2. GET /categories
      if (query.includes('FROM categories')) {
        return { rows: [
          { id: 1, name: 'Điện thoại', slug: 'dien-thoai', product_count: 5 },
          { id: 2, name: 'Laptop', slug: 'laptop', product_count: 2 }
        ]};
      }
      
      // 3. GET /products/:id
      if (query.includes('FROM products') && query.includes('WHERE p.id = $1')) {
        if (params[0] === '1') return { rows: [{ id: 1, name: 'iPhone 15', price: 1000 }] };
        if (params[0] === '999') return { rows: [] }; // Not found
      }
      
      // 4. GET /products (with category search)
      if (query.includes('FROM products') && query.includes('slug = $')) {
        return { rows: [{ id: 1, name: 'iPhone 15', category_name: 'Điện thoại' }] };
      }

      // 5. GET /products (with name search)
      if (query.includes('FROM products') && query.includes('name ILIKE $')) {
        return { rows: [{ id: 2, name: 'MacBook', category_name: 'Laptop' }] };
      }
      
      // 6. GET /products (all)
      if (query.includes('FROM products')) {
        return { rows: [
          { id: 1, name: 'iPhone 15', price: 1000 },
          { id: 2, name: 'MacBook', price: 2000 }
        ]};
      }
      
      // 7. GET /orders/lookup
      if (query.includes('FROM orders WHERE id = $1')) {
        if (params[0] === '100') return { rows: [{ id: 100, guest_email: 'test@test.com', total: 1000 }] };
        return { rows: [] };
      }
      if (query.includes('FROM order_items oi JOIN products p')) {
        return { rows: [{ id: 1, product_id: 1, quantity: 1, price: 1000, name: 'iPhone 15' }] };
      }
      
      return { rows: [] };
    }),
    connect: jest.fn().mockResolvedValue({
      query: jest.fn().mockImplementation(async (query, params) => {
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

describe('API Tests', () => {
  // 1. GET /products
  it('GET /api/products should return 200 and an array', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  // 2. GET /products with category filter
  it('GET /api/products?category=dien-thoai should filter by category', async () => {
    const response = await request(app).get('/api/products?category=dien-thoai');
    expect(response.status).toBe(200);
    expect(response.body[0].category_name).toBe('Điện thoại');
  });

  // 3. GET /products with search query
  it('GET /api/products?search=Mac should filter by name', async () => {
    const response = await request(app).get('/api/products?search=Mac');
    expect(response.status).toBe(200);
    expect(response.body[0].name).toBe('MacBook');
  });

  // 4. GET /products/:id (valid)
  it('GET /api/products/1 should return product details', async () => {
    const response = await request(app).get('/api/products/1');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe('iPhone 15');
  });

  // 5. GET /products/:id (invalid)
  it('GET /api/products/999 should return 404', async () => {
    const response = await request(app).get('/api/products/999');
    expect(response.status).toBe(404);
  });

  // 6. GET /categories
  it('GET /api/categories should return active categories', async () => {
    const response = await request(app).get('/api/categories');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].slug).toBe('dien-thoai');
  });

  // 7. POST /orders (missing cart items)
  it('POST /api/orders should fail if cart is empty', async () => {
    const response = await request(app).post('/api/orders').send({
      items: [],
      guest_name: 'Test',
      shipping_address: '123 Test St'
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Giỏ hàng trống');
  });

  // 8. POST /orders (missing shipping info)
  it('POST /api/orders should fail if shipping info is missing', async () => {
    const response = await request(app).post('/api/orders').send({
      items: [{ product_id: 1, quantity: 1, price: 1000 }]
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Thiếu thông tin giao hàng');
  });

  // 9. POST /orders (success)
  it('POST /api/orders should successfully create an order', async () => {
    const response = await request(app).post('/api/orders').send({
      items: [{ product_id: 1, quantity: 1, price: 1000 }],
      guest_name: 'Test Name',
      guest_email: 'test@test.com',
      shipping_address: '123 Test St',
      total: 1000
    });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.order_id).toBe(200);
  });

  // 10. GET /orders/lookup (valid)
  it('GET /api/orders/lookup should return order details', async () => {
    const response = await request(app).get('/api/orders/lookup?id=100&email=test@test.com');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(100);
    expect(response.body.items.length).toBe(1);
  });

  // 11. GET /orders/lookup (missing info)
  it('GET /api/orders/lookup should fail if missing email or id', async () => {
    const response = await request(app).get('/api/orders/lookup?id=100');
    expect(response.status).toBe(400);
  });
});
