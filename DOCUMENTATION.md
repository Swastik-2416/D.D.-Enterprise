# Full Project Documentation — Paver Project

This document provides a file-by-file explanation of the repository and how each file works together. No source files were modified.

## Overview

A minimal Node.js static server with a small submission API and an admin UI to fetch submissions. The server persists quote submissions to `data/quotes.json` and can optionally send notifications via SMTP when environment variables are configured.

## Files

**Root files**

- [server.js](server.js):
  - Implements an Express server.
  - Middleware: `cors()`, `express.json()` and `express.static(__dirname)` to serve static files from the project root.
  - Environment variables used:
    - `PORT` — server port (default `3000`).
    - `ADMIN_TOKEN` — token required by the admin `GET /api/quotes` endpoint.
    - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_TO`, `EMAIL_FROM` — optional SMTP settings for `sendNotification()`.
  - Endpoints:
    - `POST /api/quotes` — Accepts JSON payloads. Requires `name`, `phone`, and `message`. Appends the submission to `data/quotes.json` and returns `{ ok: true }` on success. On save, it calls `sendNotification()` (fire-and-forget) which attempts to send an email when SMTP variables are set.
    - `GET /api/quotes` — Returns the saved submissions only when the request `Authorization` header equals `Bearer <ADMIN_TOKEN>`; otherwise returns 401.
  - Data directory handling: creates `data/` and `data/quotes.json` if missing; uses JSON array format.
  - Security notes: the admin endpoint is protected by a simple token; ensure `ADMIN_TOKEN` is kept secret in production. SMTP credentials are read from env vars and not stored in the repo.

- [package.json](package.json):
  - Project metadata and `scripts.start` invoking `node server.js`.
  - Dependencies: `express`, `cors`, `nodemailer`.

- [README.md](README.md):
  - Quick start, install, and run instructions.

- [CONTRIBUTING.md](CONTRIBUTING.md):
  - Guidelines for reporting issues and contributing changes.

- [DOCUMENTATION.md](DOCUMENTATION.md):
  - (This file) Full per-file documentation.

**Frontend / Static files**

- [index.html](index.html):
  - Main marketing/front-facing single-page HTML.
  - Contains inline CSS styles and the complete page layout and components.
  - Uses Google Fonts `Inter`.
  - Includes a hero section, navigation, UI elements and various utility styles.
  - Likely contains a form or client-side code (not altered) that posts to `POST /api/quotes` for submissions — verify the form `action` or fetch usage if modifying behavior.
  - The file is quite long (many inline styles and sections); it should be served as static content by the server.

- [admin.html](admin.html):
  - Simple admin UI to load saved submissions from `GET /api/quotes` using the admin token.
  - Features:
    - An input for the admin token and a `Load submissions` button that fetches `/api/quotes` with `Authorization: Bearer <token>`.
    - Renders a table of submissions with fields: `name`, `phone`, `email`, `city`, `type`, `message`, `submittedAt`.
    - A `Download CSV` button that exports the loaded submissions to a CSV file.
  - Intended for local admin usage; do not expose the token publicly.

- `index.html.bak`:
  - A short textual backup placeholder indicating historic backup. Keep it as-is.

**Data**

- `data/quotes.json`:
  - JSON array persisted by `server.js` when new `POST /api/quotes` submissions are received.
  - Initially empty in this repository (`[]`).

## How things work together

- The Express server serves `index.html` and other static assets. When a visitor submits a quote (via whatever front-end form exists in `index.html`), the client posts JSON to `POST /api/quotes`.
- Submissions are appended to `data/quotes.json` on disk. The admin can retrieve all submissions by visiting `admin.html`, entering the `ADMIN_TOKEN`, and clicking `Load submissions`.
- If SMTP environment variables are provided, `server.js` will attempt to send an email notification (to `EMAIL_TO` or `SMTP_USER`) for each submission.

## Deployment and environment

- Recommended minimal env vars for production:
  - `PORT` — port to listen on.
  - `ADMIN_TOKEN` — random strong string used to protect the admin API.
  - Optional SMTP settings: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_TO`, `EMAIL_FROM`.

- Run with:

```bash
npm install
npm start
```

- To run behind a reverse proxy, set `PORT` and route traffic appropriately.

## Maintenance notes

- Backups: `data/quotes.json` is the only mutable file tracked; back it up regularly if submissions are important.
- Tests: no automated tests present. Consider adding unit tests for `server.js` API handling and file I/O.
- Security: do not commit `ADMIN_TOKEN` or SMTP credentials to the repository. Use environment variables or a secret store.

## Suggested next enhancements (optional)

- Add validation and rate-limiting to `POST /api/quotes`.
- Add basic authentication flow or hashed tokens for admin API.
- Add server-side sanitization for stored messages (currently stored as provided, though email uses HTML-escaped values).
- Add automated tests and a CI workflow.

---

If you want, I can:
- Commit the documentation files to git, or
- Split documentation into `docs/` with separate files per topic, or
- Add API examples and curl snippets to this documentation.

Which would you like next?