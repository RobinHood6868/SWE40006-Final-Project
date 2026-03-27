[![CI/CD Pipeline](https://github.com/RobinHood6868/SWE40006-Final-Project/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/RobinHood6868/SWE40006-Final-Project/actions/workflows/ci-cd.yml)

# Volta Tech Store

A full-stack e-commerce application built with **React + Vite** (frontend) and **Express + Neon Postgres** (backend).

## Project Structure

```
SWE40006-Final-Project/
├── client/                 # React frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── App.jsx         # Main application component
│   │   ├── main.jsx        # Entry point
│   │   ├── index.css       # Global styles (Tailwind)
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── stores/         # State management (Zustand)
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Static assets (images, fonts)
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── app.js              # Express app (API routes + static serving)
│   ├── index.js            # Server entry point (env loading, DB connect)
│   ├── routes.js           # API route handlers
│   ├── db.js               # Neon Postgres connection & schema init
│   ├── seed.js             # Database seeding utilities
│   ├── fix-images.js       # Image path fix utility
│   ├── fix-all-images.js   # Batch image fix utility
│   └── refresh-products.js # Product refresh utility
├── __tests__/
│   └── api.test.js         # Jest + Supertest API tests (18 tests)
├── .github/workflows/
│   └── ci-cd.yml           # CI/CD pipeline (test → deploy to EC2)
├── ecosystem.config.cjs    # PM2 process manager config
├── .env.example            # Environment variable template
├── .env                    # Local env vars (git-ignored)
└── package.json            # Root package (scripts, server deps)
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **npm** (included with Node.js)
- A **Neon Postgres** database (or any PostgreSQL instance)

### 1. Install Dependencies

```bash
npm run install-all
```

This installs both server and client dependencies.

### 2. Configure Environment

Copy the template and fill in your values:

```bash
cp .env.example .env
```

Required variables:
| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `PORT` | Server port (default: `3000`) |
| `NODE_ENV` | `development` or `production` |

### 3. Run in Development

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
npm run dev:server
```
Server runs at `http://localhost:3000`

**Terminal 2 — Frontend:**
```bash
npm run dev:client
```
Vite dev server runs at `http://localhost:5173` (with hot reload)

### 4. Run Tests

```bash
npm test
```

Runs 18 API tests using Jest + Supertest with mocked database.

## Production / AWS EC2 Deployment

### Build the Frontend

```bash
npm run build
```

This runs `vite build` inside `client/`, producing `client/dist/`. The Express server serves these static files automatically.

### Start with PM2

```bash
# Using the ecosystem config
pm2 start ecosystem.config.cjs --env production

# Or directly
pm2 start server/index.js --name "volta-server"
```

### PM2 Management

```bash
pm2 status              # Check running processes
pm2 logs volta-store   # View logs
pm2 restart volta-store
pm2 stop volta-store
```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev:server` | Start Express server (development) |
| `npm run dev:client` | Start Vite dev server (hot reload) |
| `npm run build` | Build React frontend to `client/dist/` |
| `npm start` | Start Express server (production) |
| `npm test` | Run Jest API tests |
| `npm run install-all` | Install server + client dependencies |

## Notes

- `.env` contains database credentials — **never commit it to Git**
- The database schema and sample data are auto-created on first connection via `db.js`
- In production, the Express server serves both the API (`/api/*`) and the React frontend (all other routes)
