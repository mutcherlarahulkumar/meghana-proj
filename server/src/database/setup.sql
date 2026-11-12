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
