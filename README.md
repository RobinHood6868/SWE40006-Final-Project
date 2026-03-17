# Volta Tech Store

## Cấu trúc thư mục

```
Final-Project/
├── server/
│   ├── index.js
│   ├── db.js
│   └── routes.js
├── client/
│   └── index.html
├── .env
├── .gitignore
└── package.json
```

## Lần đầu chạy

**Bước 1** — Vào Neon Console → SQL Editor, chạy (Anh Dũng đã configure, các chú không cần làm bước này):

```sql
CREATE SCHEMA IF NOT EXISTS public;
ALTER DATABASE neondb SET search_path TO public;
```

**Bước 2** — Cài dependencies cho cả server và client:

```bash
npm run install-all
```

**Bước 3** — Chạy dự án:

Mở 2 terminal riêng biệt:

**Terminal 1 (Chạy Server):**
```bash
npm run dev:server
```
Server sẽ chạy tại: **http://localhost:3000**

**Terminal 2 (Chạy Client / Frontend):**
```bash
npm run dev:client
```
Frontend sẽ chạy trên cổng mà Vite cấp (thường là http://localhost:5173).

## Chạy lại lần sau

Mở 2 terminal và chạy lại 2 lệnh:
```bash
npm run dev:server
```
và
```bash
npm run dev:client
```

## Chạy với PM2 (Production)

Để giữ server chạy ngầm (nếu bị lỗi `Script not found: server.js`), hãy dùng lệnh báo cho PM2 đúng đường dẫn file:

```bash
pm2 start server/index.js --name "volta-server"
```

Hoặc sử dụng file cấu hình ecosystem đã được tạo sẵn:

```bash
pm2 start ecosystem.config.cjs
```

## Dừng server

Nhấn `Ctrl + C` trong terminal. (Nếu dùng pm2: `pm2 stop volta-server`)

## Lưu ý

- File `.env` chứa mật khẩu DB, **không được** đẩy lên GitHub
- Chỉ cần `npm install` **một lần duy nhất**
- Bước SQL trên Neon chỉ cần làm **một lần duy nhất**
