# Momentum — Goal tracker

A responsive goal tracker built with **Angular 20, Tailwind CSS, Node.js, Express 5, MySQL, and Jest**. Dashboard is the default route. Includes goal cards, search/status filters, goal details, create/edit forms, and confirmed deletion.

## Run locally

Use Node.js 22.12+ (Node.js 24 also supported) and an existing MySQL 8 database.

```bash
npm ci
cp server/.env.example server/.env
# Set your MySQL connection values in server/.env.
npm run dev
```

Open `http://localhost:4200`. Angular proxies `/api` to Express on port 3000. No database migrations or automatic table creation run. Configure the existing table according to [the database contract](server/src/database/README.md). If your existing schema differs, adapt the repository SQL there.

```bash
npm test       # Server and Angular Jest suites
npm run build # Production Angular bundle in client/dist/client/browser
npm start     # Express API only
```

Serve the built Angular directory with an SPA fallback to `index.html`, and reverse-proxy `/api` to the Express process. Browser requests use the same-origin `/api` path. Set `CLIENT_ORIGIN` and database environment variables for the deployed API. Never expose database credentials to the client.

## Separation of concerns

```text
client/src/app/
  core/          Goal types and HTTP service
  shared/        Reusable goal card
  features/      Dashboard/list, detail, create/edit screens
  app.routes.ts  Navigation
server/src/
  config/        Environment configuration
  database/      MySQL pool, all SQL, existing-table contract
  routes/        HTTP endpoint routing
  controllers/   Request parsing and HTTP responses
  services/      Goal operations and not-found behavior
  validation/    Zod input and calendar-date validation
  middleware/    Safe, centralized error responses
server/tests/    Jest API and repository tests
```

## API

| Method | Path | Behavior |
|---|---|---|
| GET | `/api/health` | Process liveness (does not check database) |
| GET | `/api/goals` | All goals, newest first |
| GET | `/api/goals/:id` | Full goal |
| POST | `/api/goals` | Create, returns 201 |
| PUT | `/api/goals/:id` | Replace editable fields |
| DELETE | `/api/goals/:id` | Delete, returns 204 |

Successful goal responses use `{ "data": ... }`. Errors use `{ "error": { "message": "..." } }`. Unknown goals return 404; invalid IDs and fields return 400.

Example create/update body:

```json
{
  "title": "Read twelve books",
  "description": "Read for twenty minutes each evening.",
  "category": "Personal growth",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "status": "pending"
}
```

Status values: `pending`, `in_progress`, `completed`. Dashboard pending count includes all goals that are not completed. Dates use `YYYY-MM-DD` and end date cannot precede start date. Category is free text with suggestions.

## Verification and scope

`npm test` covers API CRUD, invalid payloads/calendar dates/IDs, not-found responses, safe database failures, SQL parameter binding, Angular HTTP calls, and form validation. CI runs the Jest suites and production build on pushes and pull requests. Server tests inject a mocked repository; they do not require or change your database. No live database credentials are included.

This is a single-workspace client project with no authentication. Deploy on a trusted private network; add authentication and authorization before public multi-user use. The initial empty screen is intentional: no sample goals are silently inserted and no browser storage replaces MySQL.
