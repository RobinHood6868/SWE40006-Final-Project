# Volta Tech Store — Presentation Slides

> 7 slides covering all required topics. Each slide has a title, bullet points for talking, and speaker notes.

---

## Slide 1: Project Background & Problem Statement

**Title:** *Why We Need a DevOps Pipeline*

**Content:**
- **Volta Tech Store** — Vietnamese e-commerce platform for electronics (phones, laptops, accessories)
- Built with React + Express + PostgreSQL
- **Current deployment process is fully manual:**

| Problem | Impact |
|---|---|
| SSH in, `git pull`, restart manually | Slow (15–30 min per deploy) |
| No automated testing | Broken code can reach production |
| No crash recovery | App stays down until someone notices |
| No monitoring | Zero visibility into server health |

**Key question:** _How do we go from manual everything → fully automated, zero-touch deployment?_

> **Speaker notes:** Open with the pain points. Emphasize that every manual step is a risk — wrong branch, forgotten env variable, missed dependency. This project solves all of these using only free tools.

---

## Slide 2: Project Scope & Deliverables

**Title:** *What We Built — Mapped to Rubric Levels*

**Content:**

| Deliverable | Tool | Level |
|---|---|---|
| Code repository with branch protection | GitHub | Level 1 |
| CI/CD pipeline (build + test) | GitHub Actions | Level 1 |
| Automated test suite (15 tests) | Jest + Supertest | Level 1 |
| Production server | AWS EC2 (t2.micro) | Level 1 |
| App-level instrumentation (CPU, memory, uptime) | PM2 | Level 2 |
| Server-level instrumentation (disk, network) | AWS CloudWatch | Level 2 |
| Live deployed, accessible application | Express serving React build | Level 3 |
| Auto-deploy triggered by code push | GitHub Actions → SSH → EC2 | Level 4 |

**Out of scope:** Docker, HTTPS/SSL, staging environments, auto-scaling

> **Speaker notes:** Walk through each level briefly. Emphasize that we satisfied ALL four levels. Mention that every tool is within the free tier — total cost was $0.

---

## Slide 3: Design Concepts — Pipeline Architecture

**Title:** *How the Pipeline Solves the Problem*

**Content:**

Show the pipeline diagram:

```
Developer pushes to main
       ↓
GitHub Actions triggered
       ↓
npm ci → npm test (15 tests)
       ↓
   Tests pass? ─── No → Pipeline stops, team notified
       ↓ Yes
SSH into AWS EC2
       ↓
git pull → npm ci → build frontend → PM2 reload
       ↓
✅ App live in production
```

**How this addresses each problem:**
- ❌ Human error → ✅ Automated — no manual steps after `git push`
- ❌ No testing → ✅ 15 tests gate every deployment
- ❌ No crash recovery → ✅ PM2 auto-restarts in < 1 second
- ❌ No monitoring → ✅ PM2 + CloudWatch for full visibility

> **Speaker notes:** This is the core slide. Walk through the flow: "When I push code, here's exactly what happens, step by step." Stress the test gate — if any of the 15 tests fail, the deploy is blocked.

---

## Slide 4: Design & Development — Application Architecture

**Title:** *Three-Tier Architecture*

**Content:**

```
Browser (React SPA)  ←→  Express API Server  ←→  PostgreSQL (Neon Cloud)
   port 80                  port 3000                SSL connection
```

**Frontend (React + Vite + Tailwind):**
- Product browsing with category filters and debounced search
- Shopping cart persisted in localStorage
- Guest checkout with Vietnamese phone/email validation
- Order tracking by ID + email

**Backend (Express):**
- 6 REST API endpoints (`/api/products`, `/api/categories`, `/api/orders`, etc.)
- Parameterized SQL queries (prevents injection)
- Transactional order creation (BEGIN/COMMIT/ROLLBACK)
- Serves React build as static files in production

**Database (Neon PostgreSQL):**
- 4 tables: `categories`, `products`, `orders`, `order_items`
- Auto-creates schema and seeds 12 sample products on first run

> **Speaker notes:** Quick overview — don't go deep into code here. Emphasize the key design decision: Express serves both the API AND the frontend, so we only need one server process managed by PM2.

---

## Slide 5: Compatibility of Design

**Title:** *Works Everywhere It Needs To*

**Content:**

| Environment | Dev | CI | Production |
|---|---|---|---|
| **Runtime** | Node.js 20 (local) | Node.js 20 (GitHub runner) | Node.js 20 (EC2 Ubuntu) |
| **Frontend** | Vite dev server (hot reload) | Not built (API tests only) | Static files from `client/dist/` |
| **Database** | Neon (shared) | Mocked (no DB needed) | Neon (shared) |
| **Package mgmt** | `npm install` | `npm ci` (deterministic) | `npm ci` (deterministic) |

**Key compatibility decisions:**
- `package.json` enforces `"engines": { "node": ">=20.0.0" }`
- `npm ci` + lockfile guarantees identical dependencies across all environments
- Database mock in tests eliminates CI dependency on external services
- `.env.example` template ensures every environment knows what variables are needed

> **Speaker notes:** The point here is consistency. Same Node version in dev, CI, and production. Same lockfile. No "works on my machine" problems.

---

## Slide 6: Satisfying Design Requirements — Tools & Evidence

**Title:** *6 Tools, 4 Levels, Zero Cost*

**Content:**

| Tool | What It Does | Why This Tool |
|---|---|---|
| **GitHub** | Code repo + branch protection | Industry standard, triggers Actions natively |
| **GitHub Actions** | CI/CD pipeline | Built into GitHub, no extra server, 2000 free min/month |
| **Jest + Supertest** | 15 API tests | Most popular Node.js test framework, zero config |
| **AWS EC2** | Production server | Industry cloud, free tier (t2.micro, 750 hrs/month) |
| **PM2** | Process manager + app monitoring | Auto-restart on crash, CPU/memory metrics |
| **CloudWatch** | Server monitoring | Native to EC2, automatic, free tier |

**Evidence of success:**

| Metric | Target | Achieved |
|---|---|---|
| Pipeline time | < 5 min | ~2 min |
| Tests | ≥ 10 | 15 |
| Manual steps | 0 | 0 |
| Cost | $0 | $0 |
| Crash recovery | < 5 sec | ~1 sec |

> **Speaker notes:** This is your "proof" slide. Every tool maps to a rubric requirement. Every metric exceeds the target. Emphasize the zero-cost aspect.

---

## Slide 7: Code Demonstration — Live Walkthrough

**Title:** *Live Demo: Push → Auto-Deploy → Verify*

**Content (outline what you'll show live):**

**Step 1 — Show the pipeline trigger:**
- Make a small code change (e.g., update footer text)
- `git commit` and `git push origin main`
- Open GitHub Actions → watch pipeline run in real-time

**Step 2 — Show tests passing:**
- Point out the test job: 15 tests, all green
- Show that deploy job waits for tests to pass

**Step 3 — Show the deployed app:**
- Open `http://<EC2-IP>` in browser
- Browse products, filter by category, search
- Add items to cart → complete checkout → get order ID
- Track order using ID + email

**Step 4 — Show PM2 monitoring:**
- SSH into EC2
- Run `pm2 status` → show process table (CPU, memory, uptime)
- Run `pm2 monit` → show real-time dashboard

**Step 5 — Show crash recovery:**
- Kill the Node process: `pm2 stop volta-store && pm2 start volta-store`
- Show restart count increment → app is live again in < 1 second

> **Speaker notes:** This is the most important slide — it's actually a LIVE DEMO. Practice this flow beforehand. Have the EC2 public IP ready. If the demo fails, have screenshots as backup.

---

## Backup: Printable Slide Summary

| Slide | Topic | Time |
|---|---|---|
| 1 | Background & problem statement | 1–2 min |
| 2 | Scope & deliverables (rubric mapping) | 1 min |
| 3 | Pipeline architecture (the solution) | 2 min |
| 4 | App architecture (3-tier design) | 1–2 min |
| 5 | Compatibility (dev/CI/prod consistency) | 1 min |
| 6 | Tools & evidence (metrics) | 1 min |
| 7 | Live demo | 3–5 min |
| | **Total** | **~10–13 min** |
