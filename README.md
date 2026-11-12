<div align="center">

# 🌿 Momentum

### Small steps. Big possibilities.

A clean, creative goal tracker for turning everyday intentions into achievements.

**Angular 20 · Tailwind CSS · Express 5 · MySQL 8 · Jest**

[Quick start](#-quick-start) · [Configuration](#-configuration) · [Commands](#-command-reference) · [Architecture](#-project-structure)

</div>

---

## ✨ Your space to grow

| Screen            | What you can do                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------- |
| **Dashboard**     | Start with a welcome message, total/completed/pending counts, and a quick way to add a goal. |
| **My goals**      | Browse simple goal cards, search by text, and filter by status.                              |
| **Goal details**  | Read the complete goal, edit its fields, or delete it with confirmation.                     |
| **Create & edit** | Set a title, description, category, start date, end date, and status.                        |

The responsive UI uses sage-green tones, a simple sidebar, clear cards, and dedicated empty, loading, and error states. `/dashboard` is the default page.

## 🧰 Requirements

| Requirement  | Version / setup                                                    |
| ------------ | ------------------------------------------------------------------ |
| **Node.js**  | **22.12+ in the 22.x line**, or **24.x**                           |
| **npm**      | Included with Node.js; use npm workspaces from the repository root |
| **MySQL**    | **8.x**, running locally or on an accessible server                |
| **Database** | An existing database containing the expected `goals` table         |
| **Git**      | Required to clone the repository                                   |
| **Browser**  | A current Chrome, Edge, Firefox, or Safari release                 |

No global Angular CLI installation is needed. Project scripts use the locally installed CLI.

## 🚀 Quick start

### 1. Clone and select the project branch

```bash
git clone --branch feat/goal-tracker https://github.com/mutcherlarahulkumar/meghana-proj.git
cd meghana-proj
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure the backend

Open **`server/src/config.js`** and change the database values to match your MySQL installation. No `.env` file or environment-variable setup is needed.

### 4. Check the existing database

Start MySQL and confirm that the configured account can access the database and `goals` table. The required columns and types are documented in the [existing database contract](server/src/database/README.md).

**The app does not create databases, create tables, run migrations, or insert sample goals.** If your existing column names differ, update the SQL in `server/src/database/goal.repository.js`.

### 5. Start the project

Run this from the repository root:

```bash
npm run dev
```

| Service              | Local address                      |
| -------------------- | ---------------------------------- |
| **Angular frontend** | <http://localhost:4200>            |
| **Express API**      | <http://localhost:3000/api/goals>  |
| **API liveness**     | <http://localhost:3000/api/health> |

Open **http://localhost:4200** to use the app. Angular forwards `/api` requests to Express. Use **Ctrl+C** to stop development processes.

> The health endpoint checks the API process only. Open `/api/goals` to verify that the API can also read the database.

## ⚙️ Configuration

All backend settings are hardcoded in **`server/src/config.js`**. Edit this one file before running the app:

```javascript
module.exports = {
  port: 3000,
  clientOrigin: 'http://localhost:4200',
  database: {
    host: '127.0.0.1',
    port: 3306,
    user: 'goal_tracker',
    password: 'change-me',
    database: 'goal_tracker',
  },
};
```

| Setting             | What to change                                          |
| ------------------- | ------------------------------------------------------- |
| `port`              | Express API port; leave `3000` for the default setup    |
| `clientOrigin`      | Frontend address; leave `http://localhost:4200` locally |
| `database.host`     | Your MySQL hostname or IP                               |
| `database.port`     | MySQL port, usually `3306`                              |
| `database.user`     | Your existing MySQL username                            |
| `database.password` | Replace `change-me` with your actual MySQL password     |
| `database.database` | Name of your existing database containing `goals`       |

Restart the API after editing this file. If you change the API `port`, update the target port in `client/proxy.conf.json` too. MySQL settings remain on the backend; the frontend uses `/api` and needs no separate configuration.

Use a MySQL account with `SELECT`, `INSERT`, `UPDATE`, and `DELETE` privileges on the goal table. The committed settings are placeholders; keep actual passwords private when sharing the project.

There are no login/signup pages or authentication requirements. All app pages are open, and goals are shared within this single workspace.

## ⌨️ Command reference

Run all commands below from the **repository root**.

| Command                 | Purpose                                                                       |
| ----------------------- | ----------------------------------------------------------------------------- |
| `npm ci`                | Install exact dependencies from the lockfile                                  |
| `npm run dev`           | Start Angular and the Express API together                                    |
| `npm start -w client`   | Start Angular only on port 4200                                               |
| `npm run dev -w server` | Start the API only with automatic restart                                     |
| `npm start`             | Start the API without watch mode                                              |
| `npm test`              | Run backend and frontend Jest tests                                           |
| `npm test -w server`    | Run API and database repository unit tests                                    |
| `npm test -w client`    | Run Angular service, dashboard, and form tests                                |
| `npm run build`         | Create the optimized Angular production bundle                                |
| `npm run format`        | Format supported source, configuration, and documentation files with Prettier |
| `npm run format:check`  | Check formatting without changing files                                       |

Prettier settings are stored in `.prettierrc.json`. Generated output, dependencies and the npm lockfile are excluded through `.prettierignore`.

## 🗂️ Project structure

```text
meghana-proj/
├── client/
│   ├── src/app/
│   │   ├── app.component.ts / .html          # Sidebar and app shell
│   │   ├── app.routes.ts                     # Frontend navigation
│   │   ├── overview.component.ts / .html     # Dashboard and goal list
│   │   ├── goal-detail.component.ts / .html  # Full goal and delete action
│   │   ├── goal-form.component.ts / .html    # Create and edit form
│   │   ├── goal-card.component.ts / .html    # Reusable goal card
│   │   ├── goal.service.ts                   # API requests
│   │   ├── goal.model.ts                     # Goal fields and status labels
│   │   └── *.spec.ts                         # Tests next to the code
│   ├── src/styles.css      # Tailwind directives and visual styling
│   └── proxy.conf.json     # Local /api → Express forwarding
├── server/
│   ├── src/
│   │   ├── index.js        # Start and stop the server
│   │   ├── app.js          # Express setup and error handling
│   │   ├── config.js       # Hardcoded API and MySQL settings
│   │   ├── goals.js        # Goal routes and input validation
│   │   └── database/       # MySQL pool, goal queries, table contract
│   └── tests/              # API and repository Jest tests
├── .prettierrc.json         # Shared formatting rules
└── package.json            # Workspace scripts
```

**Request flow:** Angular page → HTTP service → `goals.js` → database queries → MySQL.

### Understanding the frontend

All frontend files live directly in `client/src/app`; there are no `core`, `shared`, or `features` folders. Open a page's `.component.html` to change its markup and the matching `.component.ts` to change its behavior. The dashboard and goal list share `overview`; create and edit share `goal-form`.

`app.routes.ts` maps URLs to pages, `goal.service.ts` contains the API calls, and `goal.model.ts` describes the goal fields. Tailwind and the visual styles stay in `client/src/styles.css`. Tests sit alongside the files they check.

### Understanding the backend

Start with `server/src/index.js`: it starts the Express app. `config.js` holds the hardcoded settings. `app.js` configures Express and handles errors. `goals.js` contains the five goal endpoints and their input validation together. Each endpoint calls a database function directly.

All MySQL code stays inside `server/src/database`: `pool.js` opens connections and `goal.repository.js` holds the SQL queries. There are no separate controller or service layers to navigate.

## 🔌 API reference

| Method   | Endpoint         | Result                       |
| -------- | ---------------- | ---------------------------- |
| `GET`    | `/api/health`    | Process liveness             |
| `GET`    | `/api/goals`     | All goals, newest first      |
| `GET`    | `/api/goals/:id` | Complete goal details        |
| `POST`   | `/api/goals`     | Create a goal; returns `201` |
| `PUT`    | `/api/goals/:id` | Update all editable fields   |
| `DELETE` | `/api/goals/:id` | Delete a goal; returns `204` |

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

- Status values: `pending`, `in_progress`, `completed`.
- Dashboard pending count includes every goal that is not completed.
- Dates use `YYYY-MM-DD`; the end date cannot precede the start date.
- Category accepts free text and offers suggestions.
- Goal responses use `{ "data": ... }`; errors use `{ "error": { "message": "..." } }`.
- Invalid IDs or fields return `400`. Missing goals return `404`.

## 🧪 Testing

Jest covers API CRUD, invalid dates and IDs, missing goals, safe database errors, SQL parameter binding, Angular HTTP calls, dashboard counts, filtering, and form validation.

```bash
npm test
npm run format:check
npm run build
```

Tests mock database access; they do not connect to or change your MySQL database. A live database smoke test requires your configured MySQL instance. Automated GitHub Actions workflows are not included.

## 📦 Production build

```bash
npm ci
npm test
npm run build
npm start
```

The Angular output is **`client/dist/client/browser`**. Serve that directory with an SPA fallback to `index.html`, and reverse-proxy `/api` to Express. `npm start` runs the API only; it does not serve the Angular bundle. Set the database values and frontend origin in `server/src/config.js` before starting the API.

## 🛠️ Troubleshooting

| Symptom                                            | What to check                                                                                        |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Goals do not load                                  | Confirm MySQL is running, settings in `server/src/config.js` are correct, and `/api/goals` responds. |
| Access denied by MySQL                             | Check the username, password, allowed host, and table privileges.                                    |
| Missing table or column                            | Compare the existing schema with the [database contract](server/src/database/README.md).             |
| API connection fails                               | Confirm the API port matches `client/proxy.conf.json`.                                               |
| Port already in use                                | Stop the conflicting process, or configure another port and update the proxy.                        |
| Refreshing a detail page returns 404 in production | Configure the frontend server to fall back to `index.html`.                                          |

---

<div align="center">

**One goal at a time. ↗**

A single-workspace client project. Authentication is not included; use a trusted private environment until access controls are added.

</div>
