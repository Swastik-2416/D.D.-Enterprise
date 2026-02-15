# Full Project Documentation — Paver Project

This document provides a file-by-file explanation of the repository and how each file works together.

## Overview

A Node.js server with a SQLite database backend for handling quote submissions. It includes a submission API and an admin UI to fetch, filter, and sort submissions. The server persists data to `data/database.sqlite` and can optionally send notifications via SMTP when environment variables are configured.

## Files

**Root files**

- [server.js](server.js):
  - Implements an Express server.
  - Middleware: `cors()`, `express.json()` and `express.static(__dirname)` to serve static files.
  - Environment variables used:
    - `PORT` — server port (default `3000`).
    - `ADMIN_TOKEN` — token required by the admin `GET /api/quotes` and `PATCH /api/quotes/:id` endpoints.
    - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_TO`, `EMAIL_FROM` — optional SMTP settings for `sendNotification()`.
  - Endpoints:
    - `POST /api/quotes` — Accepts JSON payloads. Requires `name`, `phone`, and `message`. Inserts the submission into `project_requests` table in `data/database.sqlite` and returns `{ ok: true, id: <id> }` on success. Asynchronously calls `sendNotification()`.
    - `GET /api/quotes` — Returns submissions. Requires `Authorization: Bearer <ADMIN_TOKEN>`.
      - Query params:
        - `filter=unread`: Returns only unread submissions.
        - `sort=oldest`: Sorts by `submitted_at` ascending (default is descending).
    - `PATCH /api/quotes/:id` — Updates a submission (e.g., mark as read). Requires `Authorization: Bearer <ADMIN_TOKEN>`.
      - Body: `{ is_read: <boolean> }`.
  - Data directory handling: creates `data/` if missing.
  - Security notes: the admin endpoint is protected by a simple token; ensure `ADMIN_TOKEN` is kept secret in production.

- [database.js](database.js):
  - Handles SQLite database connection and initialization.
  - Creates `data/database.sqlite` if it doesn't exist.
  - Defines the `project_requests` table schema:
    - `id`, `name`, `company`, `email`, `phone`, `city`, `type`, `message`, `submitted_at`, `is_read`.
  - Exports helper functions: `run` (INSERT/UPDATE), `query` (SELECT all), `get` (SELECT one).

- [package.json](package.json):
  - Project metadata and `scripts.start`.
  - Dependencies: `express`, `cors`, `nodemailer`, `sqlite3`.

- [README.md](README.md):
  - Quick start, install, and run instructions.

- [CONTRIBUTING.md](CONTRIBUTING.md):
  - Guidelines for reporting issues and submitting changes.

- [DOCUMENTATION.md](DOCUMENTATION.md):
  - (This file) Full per-file documentation.

**Frontend / Static files**

- [index.html](index.html):
  - Main marketing/front-facing single-page HTML.
  - Contains inline CSS styles and the complete page layout and components.
  - Uses Google Fonts `Inter`.
  - Clients-side form posts to `POST /api/quotes` for submissions.

- [admin.html](admin.html):
  - Admin UI to manage submissions.
  - Features:
    - Authenticate with `ADMIN_TOKEN`.
    - Fetch submissions via `GET /api/quotes`.
    - Sort and filter options (Read/Unread, Newest/Oldest).
    - Mark submissions as read via checkbox (calls `PATCH /api/quotes/:id`).
    - Download CSV export of currently loaded data.

- `index.html.bak`:
  - Backup of an older version of `index.html`.

**Data**

- `data/database.sqlite`:
  - SQLite database file created by `database.js`.
  - Contains the `project_requests` table.
  - Ignored by git (via `.gitignore` if present/configured).

## How things work together

- The Express server serves `index.html` and other static assets. When a visitor submits a quote, the client posts JSON to `POST /api/quotes`.
- `server.js` uses `database.js` to insert the record into the SQLite database.
- The admin retrieves submissions by visiting `admin.html`, which requests `GET /api/quotes` using the `ADMIN_TOKEN`.
- If SMTP environment variables are provided, `server.js` attempts to send an email notification.

## Deployment and environment

- Recommended minimal env vars for production:
  - `PORT` — port to listen on.
  - `ADMIN_TOKEN` — random strong string used to protect the admin API.
  - Optional SMTP settings.

- Run with:
  ```bash
  npm install
  npm start
  ```

## Maintenance notes

- Backups: `data/database.sqlite` contains all submission data; back it up regularly.
- Database: The schema is defined in `database.js`. Migrations would be needed for schema changes in existing databases.