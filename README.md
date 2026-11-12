<div align="center">

# 🌿 Momentum

### Small steps. Big possibilities.

A clean, creative goal tracker for turning everyday intentions into achievements.

**Angular 20 · Tailwind CSS · Express 5 · MySQL 8 · Jest**

[Quick start](#-quick-start) · [Workbench setup](#4-create-the-database-goal-table-and-application-user) · [Commands](#-command-reference) · [Architecture](#-project-structure)

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

| Tool                 | What to install                                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js + npm**    | Node.js **22.12+ in the 22.x line**, or **24.x**, from [nodejs.org](https://nodejs.org/). npm is included.                                                    |
| **MySQL Server**     | MySQL Community Server **8.x**, from [MySQL downloads](https://dev.mysql.com/downloads/mysql/). Remember the administrator/root password chosen during setup. |
| **MySQL Workbench**  | Install [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) to connect to the server and run the SQL below.                                         |
| **Git**              | Install from [git-scm.com](https://git-scm.com/downloads).                                                                                                    |
| **Editor + browser** | For example, VS Code and a current Chrome, Edge, Firefox, or Safari.                                                                                          |

**Workbench is the database client; MySQL Server is the database service. You need both.** Keep the server running while using the app. No global Angular CLI, `.env` file, app login, or signup is required.

## 🚀 Quick start

Follow these steps in order on a fresh local machine.

### 1. Install tools and start MySQL Server

Install the tools above. On Windows, MySQL Installer can install both Server and Workbench; configure the server on port **3306** and save the root password. On macOS/Linux, install MySQL Server and Workbench for your OS and complete the server's initial password setup.

Start the MySQL service using your installation's service manager:

| OS      | Typical way to start it                                                                                                       |
| ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Windows | Open **Services**, find your MySQL service (often `MySQL80` or `MySQL84`), and choose **Start**.                              |
| macOS   | Use the **MySQL** system settings pane for the official installer, or `brew services start mysql` if installed with Homebrew. |
| Linux   | Use your distribution's service manager, commonly `sudo systemctl start mysql`.                                               |

Open a terminal and check:

```bash
node --version
npm --version
git --version
```

### 2. Clone the project and install dependencies

```bash
git clone --branch feat/goal-tracker https://github.com/mutcherlarahulkumar/meghana-proj.git
cd meghana-proj
npm ci
```

If you already cloned the repository, open a terminal in that folder and select `feat/goal-tracker` instead of cloning again. Run every npm command in this guide from the folder containing the **root `package.json`**.

### 3. Connect MySQL Workbench as administrator

1. Open **MySQL Workbench**.
2. Under **MySQL Connections**, click **+** (or open an existing local administrator connection).
3. Set **Connection Name** to `Local MySQL Admin`.
4. Choose **Standard (TCP/IP)** as the connection method.
5. Set **Hostname** to `127.0.0.1`, **Port** to `3306`, and **Username** to `root` (or your administrator account).
6. Click **Test Connection**, enter your MySQL administrator password, then save/open the connection.
7. Open a new **SQL query tab** with the SQL tab button or **File → New Query Tab**.

The root password is the one set when installing MySQL. It is different from the application database password created next.

### 4. Create the database, goal table, and application user

Paste the complete SQL below into the query tab and click the **lightning bolt to execute all statements**. Alternatively, use **File → Open SQL Script** to open [`server/src/database/setup.sql`](server/src/database/setup.sql), then execute it.

This creates a dedicated local database user called `goal_tracker` with the example password **`change-me`**. These values match the committed `server/src/config.js`, so the default local setup works without editing additional files. You can choose another password, but change it in **both** `CREATE USER` statements and `config.js`.

```sql
-- Run in MySQL Workbench as root (or another administrator).
-- Local development example password: change-me.
-- If you choose another password, use it in both CREATE USER statements
-- and in server/src/config.js.
CREATE DATABASE IF NOT EXISTS goal_tracker
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE goal_tracker;

CREATE TABLE IF NOT EXISTS goals (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(60) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Both local host entries support local TCP connections across installations.
CREATE USER IF NOT EXISTS 'goal_tracker'@'localhost' IDENTIFIED BY 'change-me';
CREATE USER IF NOT EXISTS 'goal_tracker'@'127.0.0.1' IDENTIFIED BY 'change-me';
GRANT SELECT, INSERT, UPDATE, DELETE ON goal_tracker.goals TO 'goal_tracker'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON goal_tracker.goals TO 'goal_tracker'@'127.0.0.1';

SHOW TABLES;
DESCRIBE goals;
SELECT COUNT(*) AS total_goals FROM goals;
```

Check the **Action Output** panel for errors. Refresh the **Schemas** sidebar: you should see **goal_tracker → Tables → goals**. The final query returns `0` for a newly created empty table. Empty goals are expected; the app does not insert sample data.

`IF NOT EXISTS` preserves existing databases, tables, and users. It does **not** fix a mismatched existing table or reset an existing user's password. If you already have a `goals` table, compare `DESCRIBE goals` with the definition above; adapt `goal.repository.js` if your column names differ. Back up existing data before manually changing its structure.

### 5. Verify the application database user in Workbench

Create a second Workbench connection with these settings:

| Workbench field   | Value                                            |
| ----------------- | ------------------------------------------------ |
| Connection Name   | `Momentum App`                                   |
| Connection Method | `Standard (TCP/IP)`                              |
| Hostname          | `127.0.0.1`                                      |
| Port              | `3306`                                           |
| Username          | `goal_tracker`                                   |
| Password          | `change-me`, or the password you chose in step 4 |
| Default Schema    | `goal_tracker`                                   |

Click **Test Connection**, then open it and run:

```sql
USE goal_tracker;
SELECT CURRENT_USER() AS connected_account;
SELECT * FROM goals ORDER BY id DESC;
```

These queries must succeed before starting the project. The application account can read and edit goals; use the administrator connection for database/table/user setup.

If this username already existed with a different password, open the **administrator connection** and reset the dedicated app account intentionally:

```sql
ALTER USER 'goal_tracker'@'localhost' IDENTIFIED BY 'change-me';
ALTER USER 'goal_tracker'@'127.0.0.1' IDENTIFIED BY 'change-me';
```

If you chose a different password, substitute it in both statements and the backend configuration. Re-enter the new password in Workbench's saved app connection.

### 6. Check the hardcoded backend settings

Open **`server/src/config.js`**:

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

With the SQL above, **no changes are needed**. If your installation differs, edit these values:

| Setting             | What to change                                                                     |
| ------------------- | ---------------------------------------------------------------------------------- |
| `port`              | Express API port; default `3000`. Also update `client/proxy.conf.json` if changed. |
| `clientOrigin`      | Frontend browser address; default `http://localhost:4200`.                         |
| `database.host`     | Match Workbench's app connection hostname; default `127.0.0.1`.                    |
| `database.port`     | Match the MySQL Server port; default `3306`.                                       |
| `database.user`     | Match the dedicated MySQL account; default `goal_tracker`.                         |
| `database.password` | Match that account's password; default example is `change-me`.                     |
| `database.database` | Match the schema containing `goals`; default `goal_tracker`.                       |

Restart the API after editing this file. All settings are plain JavaScript values: **there is no `.env` setup or environment-variable dependency**. Database settings stay on the backend; the frontend calls `/api` through its development proxy. The committed password is a local example; keep actual passwords private when sharing changes.

### 7. Start Angular and Express

From the project root:

```bash
npm run dev
```

Leave that terminal running. It starts the API and Angular together.

| Service      | Local address                      | Expected result                                  |
| ------------ | ---------------------------------- | ------------------------------------------------ |
| API liveness | <http://localhost:3000/api/health> | `{ "status": "ok" }`                             |
| Goals API    | <http://localhost:3000/api/goals>  | `{ "data": [] }` for a new database              |
| Frontend     | <http://localhost:4200>            | Dashboard with zero goals and an Add goal button |

The health endpoint checks only the Express process; **`/api/goals` also checks the database connection and table**. If the frontend cannot load goals, fix this endpoint first. Use **Ctrl+C** to stop the app. MySQL must stay running whenever you use it.

### 8. Confirm the complete flow

1. Open <http://localhost:4200>, click **Add goal**, and enter a title, category, start date, end date, and status.
2. Save the goal. Its detail page should open.
3. In your **Momentum App** Workbench connection, run:

```sql
SELECT id, title, description, category, start_date, end_date, status
FROM goal_tracker.goals
ORDER BY id DESC;
```

4. Confirm that your new goal appears in MySQL. Refresh the browser: it should still be there.
5. Edit its status to **Completed**, then check the dashboard counts and rerun the query.
6. Delete that test goal in the app, confirm deletion, and rerun the query to confirm it was removed.

There are no app login/signup pages. All pages are open and goals belong to one shared local workspace.

### 9. Optional: test SQL manually without keeping sample data

In the app's Workbench connection, execute this **whole block in one session**. It checks the four granted operations and rolls back the test row at the end. An auto-increment ID may still be consumed; gaps in IDs are normal.

```sql
USE goal_tracker;
START TRANSACTION;

INSERT INTO goals (title, description, category, start_date, end_date, status)
VALUES ('Workbench test', 'Temporary SQL check', 'Learning', '2026-01-01', '2026-12-31', 'pending');
SET @test_goal_id = LAST_INSERT_ID();

SELECT * FROM goals WHERE id = @test_goal_id;
UPDATE goals SET status = 'completed' WHERE id = @test_goal_id;
SELECT id, title, status FROM goals WHERE id = @test_goal_id;
DELETE FROM goals WHERE id = @test_goal_id;
SELECT COUNT(*) AS remaining_test_rows FROM goals WHERE id = @test_goal_id;

ROLLBACK;
```

`remaining_test_rows` should be `0`. If you stop execution before the end, run `ROLLBACK;` in that same connection. The application never runs this script automatically.

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
│   │   └── database/       # MySQL pool, goal queries, setup.sql, table contract
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

### MySQL Workbench setup errors

| Error                                     | How to resolve it                                                                                                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cannot connect to `127.0.0.1:3306`        | Start MySQL Server, check its actual port, and test the administrator Workbench connection first. Installing Workbench alone does not install a running server.   |
| `Access denied for user 'root'`           | Use your installation's actual administrator username/password. The example app password does not apply to root.                                                  |
| `Access denied for user 'goal_tracker'`   | Check the app user's password with the second Workbench connection. If necessary, run the `ALTER USER` statements above as administrator, then match `config.js`. |
| `CREATE USER` / `GRANT` permission denied | Run the setup script through the administrator connection, not the restricted app connection.                                                                     |
| `Unknown database 'goal_tracker'`         | Run the database setup SQL and verify `database.database` in `config.js`.                                                                                         |
| `No database selected`                    | Execute `USE goal_tracker;` before table queries, or double-click the schema in Workbench.                                                                        |
| Existing table has different columns      | `CREATE TABLE IF NOT EXISTS` leaves it unchanged. Compare `DESCRIBE goals;` with the documented schema and adapt the repository queries.                          |
| Password rejected by MySQL policy         | Choose a password accepted by your server, use it in both user statements, and update `database.password` in `config.js`.                                         |
| Workbench shows stale rows                | Rerun the `SELECT` query; the results grid does not refresh automatically after changes in the app.                                                               |

---

<div align="center">

**One goal at a time. ↗**

A single-workspace client project. Authentication is not included; use a trusted private environment until access controls are added.

</div>
