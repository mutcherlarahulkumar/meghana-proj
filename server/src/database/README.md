# Existing database contract
The application assumes a `goals` table already exists. No schema is created or changed on startup.

| Column | Expected MySQL type |
|---|---|
| id | INT UNSIGNED PRIMARY KEY AUTO_INCREMENT |
| title | VARCHAR(120) NOT NULL |
| description | TEXT NOT NULL |
| category | VARCHAR(60) NOT NULL |
| start_date | DATE NOT NULL |
| end_date | DATE NOT NULL |
| status | ENUM('pending','in_progress','completed') NOT NULL |

If your existing names differ, change only `goal.repository.js`. All SQL and connection configuration live in this directory. Use a dedicated account with SELECT, INSERT, UPDATE, DELETE privileges. Production API has no authentication: use only on a trusted private network until authentication/authorization is added.
