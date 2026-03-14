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

**Bước 2** — Cài dependencies:
```bash
npm install
```

**Bước 3** — Chạy server:
```bash
node server/index.js
```

Mở trình duyệt vào: **http://localhost:3000**

## Chạy lại lần sau

```bash
node server/index.js
```

## Dừng server

Nhấn `Ctrl + C` trong terminal.

## Lưu ý

- File `.env` chứa mật khẩu DB, **không được** đẩy lên GitHub
- Chỉ cần `npm install` **một lần duy nhất**
- Bước SQL trên Neon chỉ cần làm **một lần duy nhất**