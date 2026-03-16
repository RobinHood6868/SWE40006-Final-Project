# API Test Documentation

This document outlines the 11 tests implemented in [__tests__/api.test.js](file:///d:/Uni/SWE40006-Final-Project/__tests__/api.test.js) using Jest and Supertest to verify the functionality of the eCommerce API endpoints. 

The tests use a mocked database connection ([server/db.js](file:///d:/Uni/SWE40006-Final-Project/server/db.js)) to ensure they can run quickly and reliably in CI/CD environments (like GitHub Actions) without needing a live PostgreSQL database.

## 1. Products Endpoints (`/api/products`)

| Test Case | Method | Endpoint | Expected Behavior |
| :--- | :--- | :--- | :--- |
| **List All Products** | `GET` | `/api/products` | Returns a `200 OK` status and an array of products. |
| **Filter by Category** | `GET` | `/api/products?category=dien-thoai` | Returns a `200 OK` status and an array of products filtered by the requested category slug. |
| **Search by Name** | `GET` | `/api/products?search=Mac` | Returns a `200 OK` status and products matching the search keyword. |
| **Get Single Product (Valid)** | `GET` | `/api/products/1` | Returns a `200 OK` status and the specific product object matching the ID. |
| **Get Single Product (Invalid)** | `GET` | `/api/products/999` | Returns a `404 Not Found` status when requesting a product ID that does not exist. |

## 2. Categories Endpoint (`/api/categories`)

| Test Case | Method | Endpoint | Expected Behavior |
| :--- | :--- | :--- | :--- |
| **List Categories** | `GET` | `/api/categories` | Returns a `200 OK` status and an array of all active categories. |

## 3. Orders Endpoints (`/api/orders`)

| Test Case | Method | Endpoint | Expected Behavior |
| :--- | :--- | :--- | :--- |
| **Create Order (Empty Cart)** | `POST` | `/api/orders` | Returns a `400 Bad Request` status with an error message `"Giỏ hàng trống"` if the `items` array is empty or missing. |
| **Create Order (Missing Shipping)** | `POST` | `/api/orders` | Returns a `400 Bad Request` status with an error message `"Thiếu thông tin giao hàng"` if required shipping details (like name and address) are missing. |
| **Create Order (Success)** | `POST` | `/api/orders` | Returns a `200 OK` status, `success: true`, and the new `order_id` when valid cart items and shipping details are provided. |
| **Lookup Order (Valid)** | `GET` | `/api/orders/lookup?id=100&email=test@test.com` | Returns a `200 OK` status and the full order details (including items) when a valid matching order ID and email are provided. |
| **Lookup Order (Missing Data)** | `GET` | `/api/orders/lookup?id=100` | Returns a `400 Bad Request` status with an error message `"Cần mã đơn và email"` if the request is missing either the order ID or the email address. |

## Running the Tests
To execute these tests, run the following command in the root directory:
```bash
npm test
```
*Note: This runs `cross-env NODE_OPTIONS=--experimental-vm-modules jest` as configured in [package.json](file:///d:/Uni/SWE40006-Final-Project/package.json) to support ES module imports.*
