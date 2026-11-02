# TechAtlas

Local-first, open-source learning hub. A metadata-only aggregator for IT learning resources —
tutorials, repos, courses, cheatsheets — with full-text search, domain classification, deals, and
bookmarks. Stores titles/descriptions/tags only; all content rights belong to the source authors.

## Stack

- **backend/** — Express 5 + TypeScript + `pg`, tsvector full-text search + pg_trgm fuzzy matching,
  keyword classifier, plugin registry (auto-loads `src/plugins/*/index.ts`), collector
  (`npm run collect`) with a GitHub topic fetcher.
- **frontend/** — React 19 + Vite + TypeScript + Tailwind v4 + React Router.
  Feature-folder routing: `src/features/*/index.tsx` exports `routes` and is auto-registered by
  `import.meta.glob` in `src/App.tsx`. State (bookmarks, continue-reading, dark mode) lives in
  localStorage.

## Requirements

- Node 20+
- PostgreSQL 14+ with `pg_trgm` (bundled)

`FREE_LEARNING_SOURCES.md` holds research notes on open education sources; it is not part of the
running app.

Local dev DB (already configured in `backend/.env`):

```
postgres://techatlas:techatlas@127.0.0.1:5432/techatlas
```

If the local database or password is lost, run `scripts/reset-pg-password.ps1` from an
**elevated** PowerShell — it recreates the role, database, and password idempotently.

## Run locally

```sh
# terminal 1 — API (migrations + seed run automatically on boot, port 3001)
cd backend
npm install
npm run dev

# terminal 2 — UI (port 5173, proxies /api to :3001)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

Refresh the catalogue (classifies, checks reachability, upserts):

```sh
cd backend
npm run collect
```

Run the logic checks:

```sh
cd backend
npm run check
```

### Sources

| Collector | What it brings | Needs |
|---|---|---|
| `curated` | Hand-picked flagship **courses** (Harvard CS50 x/P/W/Cybersecurity, Full Stack Open, MDN Learn, freeCodeCamp curriculum, The Odin Project, MIT OCW + Missing Semester, Teach Yourself CS, PortSwigger Academy, TryHackMe, Hack The Box Academy, OverTheWire, Linux Foundation LFS101, Linux Upskill Challenge, Cisco NetAcad, Google ML Crash Course, fast.ai, Kaggle Learn, GitHub Skills, Atlassian Git), **practice labs** (Exercism, NeetCode, Codewars, HackerRank, Kattis, Frontend Mentor, OWASP Juice Shop, pwn.college, Root-Me), **official docs** (Python, Kubernetes, Docker, Wireshark, PostgreSQL, man7, Git, Bash, Nginx, Terraform, AWS), **career paths** (roadmap.sh: cyber, DevOps, backend, frontend, Linux, AWS), and **Professor Messer** A+/Network+/Security+ courses | nothing |
| `fmhy` | fmhy.net educational index — only the **Courses** and **Developer Learning** sections (267 reachable links: courses, CS, security, web, AI/ML, data, game dev). "Downloading" section (pirated course dumps) is never imported | nothing |
| `mslearn` | Microsoft Learn catalog (972 free learning paths + courses) | nothing |
| `github-repos` | Curated learning **paths** (developer-roadmap, OSSU, Odin Project, coding-interview-university, system-design-primer, free-programming-books, build-your-own-x, awesome) | nothing |
| `youtube` | **Video-course playlists** (and CS50's channel) discovered from channel `/playlists` pages via official RSS — freeCodeCamp, Traversy Media, Programming with Mosh, Web Dev Simplified, Net Ninja, Kevin Powell, Academind, CS50 | nothing |
| `openstax` | OpenStax open textbooks (CC BY) | nothing |
| `open-textbook-library` | Open Textbook Library (University of Minnesota) | nothing |
| `freecodecamp-rss` | freeCodeCamp News tutorials | nothing |

Open-source fetchers only store URLs that respond (HEAD/GET probe, 8s timeout, 8-way concurrency) — dead links never enter the database. Every source call has a 15s deadline. Blog aggregators, GitHub topic dumps, and per-video channel feeds are intentionally excluded (curation over volume).

## Production-style single origin

```sh
cd frontend && npm run build   # writes frontend/dist
cd ../backend && npm run build && npm start   # serves dist + API on :3001
```

Set `TRUST_PROXY=1` when running behind Caddy/Nginx/Render, so the rate limiter sees real client IPs.
Managed Postgres usually needs `?sslmode=require` on `DATABASE_URL`.

## API

| Route | Purpose |
|---|---|
| `GET /health` | Health check |
| `GET /api/plugins` | Loaded plugin names |
| `GET /api/resources` | List; filters: `difficulty`, `domain`, `category`, `source_type`, `source_name`, `limit` (max 200), `offset`; `!` prefix negates (`category=!certification`). Total in `X-Total-Count` |
| `GET /api/resources/:id` | One resource |
| `GET /api/search?q=` | tsvector search + trigram fuzzy + related tags; optional `diff=` |
| `GET /api/recent` | Recently collected |
| `GET /api/deals` | Active deals (empty until a deals source is added) |

## Structure

```
backend/
  migrations/           001_init.sql … 013_cleanup.sql (auto-applied, tracked in _migrations)
  src/
    db.ts               pool + migrate-on-boot
    index.ts            app, security, plugin loading, static serving
    plugin-registry.ts  auto-loads src/plugins/*/index.ts
    classifier.ts       keyword domain classifier
    plugins/            resources, deals (one folder = one API feature)
    collectors/         fetchers + upsert/classify store
    collect.ts          npm run collect
  tests/check.ts        npm run check
frontend/
  src/
    features/           welcome, browse, search, bookmarks, continue, resource (routes registry)
    components/         Layout, ResourceCard, SearchBar, DealBanner, filters, skeletons
    lib/                api, bookmarks, continue-reading, dark-mode (localStorage)
scripts/
  reset-pg-password.ps1 elevated, idempotent local Postgres fixer
```

## Domains

🎯 ethical-hacking · 🐧 linux-unix · 🔧 troubleshooting-it · 🌐 network-engineering ·
🛠️ devtools · 🖥️ sysadmin · 🛡️ cybersecurity · ☁️ cloud · 🤖 ai-ml

## Deploy

- Build the frontend, build the backend, then run `node dist/index.js` with `DATABASE_URL` set.
- Single instance only: migrations run on boot. Set `TRUST_PROXY=1` behind a proxy.
- Free-tier pairing that works in 2026: Render web service + Neon Postgres. Fly.io is trial-only
  and Railway/Koyeb no longer have free plans.
