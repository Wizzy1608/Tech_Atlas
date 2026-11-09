# TechAtlas

Local-first, open-source learning hub. A metadata-only aggregator for IT learning resources —
tutorials, repos, courses, cheatsheets — with full-text search, domain classification, deals, and
bookmarks. Stores titles/descriptions/tags only; all content rights belong to the source authors.

## Stack

- **backend/** — data pipeline: collectors (`npm run collect`), migrations (`npm run migrate`) and a
  JSON exporter (`npm run export`). The Express 5 server is kept for local development only.
- **frontend/** — React 19 + Vite + TypeScript + Tailwind v4 + React Router.
  Feature-folder routing: `src/features/*/index.tsx` exports `routes` and is auto-registered by
  `import.meta.glob` in `src/App.tsx`. State (bookmarks, continue-reading, dark mode) lives in
  localStorage. The deployed build reads `public/catalogue.json`; search and filters run in the
  browser (`src/lib/api.ts`).

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

## Static website (deployed)

Production is a static build: no server and no database at request time.

```
nightly Action ──► Neon Postgres ──► npm run collect ──► npm run export
                                                            │
                                          frontend/public/catalogue.json
                                                            │
push to main ──► CI ──► vite build ──► Cloudflare Pages (CDN, TLS, deploy history)
```

The browser fetches `/catalogue.json` once (about 1.1 MB, one resource per line so data refreshes
diff cleanly) and filters, paginates and searches it client-side. Bookmarks, continue-reading and
theme stay in `localStorage`. Postgres is only touched by the nightly job and by `npm run collect`
locally.

### Local static build

```sh
cd backend && npm run export      # writes frontend/public/catalogue.json
cd ../frontend && npm run build   # writes frontend/dist
npm run preview                   # http://localhost:4173, no API needed
node smoke.mjs http://localhost:4173
```

`smoke.mjs` asserts home, browse, search, a resource page and zero console errors; `PW_CHANNEL`
picks the browser (default `msedge`, CI uses `chromium`).

### One-time setup

1. **Neon** — create a free project, copy the **pooled** connection string.
2. **Load data** from your machine:

   ```sh
   cd backend
   $env:DATABASE_URL = 'postgresql://...'   # export DATABASE_URL=... on bash
   npm run migrate
   npm run collect
   npm run export
   ```

   Commit the resulting `frontend/public/catalogue.json`.
3. **Cloudflare** — Workers & Pages → Create → Pages → **Direct Upload**, project name `techatlas`.
   Create an API token with *Cloudflare Pages: Edit*.
4. **GitHub** → Settings → Secrets and variables → Actions:
   - secrets: `DATABASE_URL`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
   - variables: `CF_PAGES_PROJECT` (`techatlas` by default), `CF_PAGES_URL` (`https://techatlas.pages.dev`)
5. Push to `main`. `deploy.yml` builds and uploads `frontend/dist`.

### Workflows

| File | Trigger | Does |
|---|---|---|
| `ci.yml` | PR, push to `main` | backend typecheck + checks, frontend build, Playwright smoke |
| `deploy.yml` | push to `main`, manual, `workflow_call` | build, `wrangler pages deploy`, live URL check |
| `data.yml` | nightly 04:00 UTC, manual | migrate → collect → export → commit JSON → call deploy |

Nightly commits use `GITHUB_TOKEN`, which does not trigger other workflows, so `data.yml` calls
`deploy.yml` directly. A failed collection stops before commit and deploy, leaving the last good site
live. If Neon is unreachable, the committed `catalogue.json` still builds.

### Rollback

- Cloudflare → project → Deployments → **Rollback to this deployment** (instant, no rebuild).
- Or `git revert <sha> && git push` for a bad data commit.
- The previous server-rendered app is commit `599ef9c` on `main` — `git checkout 599ef9c` and run the
  single-origin flow below.

Search is a client-side approximation of the old Postgres FTS, so hit counts differ from older
versions; `smoke.mjs` checks non-empty results rather than exact totals.

## Production-style single origin (legacy / local)

```sh
cd frontend && npm run build   # writes frontend/dist
cd ../backend && npm run build && npm start   # serves dist + API on :3001
```

Set `TRUST_PROXY=1` when running behind Caddy/Nginx/Render, so the rate limiter sees real client IPs.
Managed Postgres usually needs `?sslmode=require` on `DATABASE_URL`.

## API (local dev server only)

| Route | Purpose |
|---|---|
| `GET /health` | Health check |
| `GET /api/plugins` | Loaded plugin names |
| `GET /api/resources` | List; filters: `difficulty`, `domain`, `category`, `source_type`, `source_name`, `limit` (max 200), `offset`; `!` prefix negates (`category=!certification`). Total in `X-Total-Count` |
| `GET /api/resources/:id` | One resource |
| `GET /api/search?q=` | tsvector search + trigram fuzzy + related tags; optional `diff=` |
| `GET /api/recent` | Recently collected |
| `GET /api/deals` | Active deals (empty until a deals source is added) |

The deployed website does not call these; equivalent behaviour is in `frontend/src/lib/api.ts`.

## Structure

```
backend/
  migrations/           001_init.sql … 013_cleanup.sql (auto-applied, tracked in _migrations)
  src/
    db.ts               pool + migrate-on-boot
    index.ts            dev server: security, plugin loading, static serving
    migrate.ts          npm run migrate (CI / setup)
    export.ts           npm run export → frontend/public/catalogue.json
    plugin-registry.ts  auto-loads src/plugins/*/index.ts
    classifier.ts       keyword domain classifier
    plugins/            resources, deals (one folder = one API feature)
    collectors/         fetchers + upsert/classify store
    collect.ts          npm run collect
  tests/check.ts        npm run check
frontend/
  public/
    catalogue.json      generated data (committed)
    _headers            Cloudflare cache policy
    _redirects          SPA fallback
  smoke.mjs             post-build browser smoke test
  src/
    features/           welcome, browse, search, bookmarks, continue, resource (routes registry)
    components/         Layout, ResourceCard, SearchBar, DealBanner, filters, skeletons
    lib/                api (static data layer), bookmarks, continue-reading, dark-mode
.github/workflows/      ci, deploy, data (nightly refresh)
scripts/
  reset-pg-password.ps1 elevated, idempotent local Postgres fixer
```

## Domains

🎯 ethical-hacking · 🐧 linux-unix · 🔧 troubleshooting-it · 🌐 network-engineering ·
🛠️ devtools · 🖥️ sysadmin · 🛡️ cybersecurity · ☁️ cloud · 🤖 ai-ml

## Deploy

- Website: Cloudflare Pages via `.github/workflows/deploy.yml` (see above).
- Data: nightly `.github/workflows/data.yml` against Neon; `catalogue.json` is committed.
- Legacy single-origin server: build frontend + backend and run `node dist/index.js` with
  `DATABASE_URL` set. Single instance only (migrations run on boot); set `TRUST_PROXY=1` behind a
  proxy.
