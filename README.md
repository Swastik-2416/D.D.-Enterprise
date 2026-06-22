# D.D. Enterprise - Quotes Server

A Node.js web application for D.D. Enterprise that serves static marketing pages and provides a backend API for handling project quote submissions.

## Features

- **MySQL Database**: Persistent storage for all quote requests using `mysql2`.
- **Email Notifications**: Automatic SMTP email alerts when a new quote is submitted.
- **Admin Dashboard UI**: A dedicated interface (`admin.html`) to manage, filter, sort, and export submissions.
- **Secure Admin API**: Token-based authentication for retrieving and managing submissions.
- **Rate Limiting**: IP-based rate limiting (max 10 submissions per IP) to prevent spam.

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MySQL Server

## Configuration

Create a `.env` file in the root of the project to configure the environment variables:

### Server Configuration
- `PORT`: Port the server runs on (default: `3000`)
- `ADMIN_TOKEN`: A secret token required to access the admin APIs.

### Database Configuration
- `DATABASE_URL`: Full MySQL connection string (optional)
- `DB_HOST`: Database host (default: `localhost`)
- `DB_USER`: Database user (default: `root`)
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name (default: `dd_enterprise`)

### SMTP Email Configuration (Optional)
- `SMTP_HOST`: Your SMTP server address
- `SMTP_PORT`: SMTP port (default: `587`)
- `SMTP_SECURE`: Use TLS (`true` or `false`)
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `EMAIL_TO`: Destination email address for notifications
- `EMAIL_FROM`: Sender email address

## Install & Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode:**
   Starts the server with the `.env` file loaded:
   ```bash
   npm run dev
   ```

3. **Run in production:**
   ```bash
   npm start
   ```

## Project Files

- `server.js` — Node/Express server serving static files and the API.
- `database.js` — MySQL connection pool and initialization script.
- `package.json` — Project metadata and scripts.
- `index.html` — Main frontend landing page.
- `admin.html` — Admin dashboard for viewing requests.
- `styles.css` — Styling for the static pages.
