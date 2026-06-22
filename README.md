# D.D. Enterprise - Website & Lead Management

The official web portal and lead generation system for **D.D. Enterprise**, a leading manufacturer of premium paver blocks, chequered tiles, and roof tiles in West Bengal.

## System Architecture & Technologies Used

This project is built using a **serverless static frontend architecture** backed by **Supabase (BaaS)**, allowing for reliable and zero-overhead hosting (e.g., via GitHub Pages).

### 1. Production Technology Stack (Active)
- **Frontend Hosting**: Entirely static HTML, CSS, and client-side JavaScript. Hostable on GitHub Pages, Netlify, Vercel, or any static host.
- **Database & Auth (Supabase)**:
  - **Supabase Database**: A PostgreSQL database hosted in the cloud. It stores all project quote enquiries in the `project_requests` table.
  - **Supabase Auth**: Email and Password-based authentication for securing access to the Admin Dashboard.
  - **Client Connection**: Loaded via CDN (`@supabase/supabase-js` v2). The client communicates directly from the user's browser to the Supabase API endpoints.
- **Client-Side Utilities**:
  - **Auto Piece Calculator**: Dynamic tiles/paver calculator inside `index.html` that estimates required pieces based on square footage or square meters.
  - **Security Captcha**: Canvas-based client-side verification captcha to prevent automated spam.
  - **Backup Storage**: Uses `localStorage` to back up quote requests client-side in case of network failures.

### 2. Legacy / Local Development Alternative Stack
A fully functional Node.js backend is also included in this repository as an alternative or for local testing:
- **Server**: Express.js server (`server.js`) that serves the static files and exposes REST API endpoints (`/api/quotes`).
- **Database**: MySQL relational database (`database.js` using `mysql2/promise`).
- **Nodemailer**: SMTP client for firing email notifications whenever a new quote is submitted.
*Note: The frontend code is configured to dynamically check if the Supabase client loads successfully. If Supabase is unavailable, it will fall back to using the local Node.js API endpoints (`/api/quotes`).*

---

## Active Supabase Features & How They Work

### Client-Side Submission (`index.html`)
When a user submits a quote request:
1. The canvas captcha code is verified.
2. The form data is compiled into a JSON payload.
3. The browser attempts to insert the record directly into the `project_requests` table on Supabase using the JS SDK client (`dbClient.from('project_requests').insert(...)`).
4. On failure, it gracefully falls back to posting to `/api/quotes` (which succeeds if the local Node.js backend is running).

### Admin Lead Management (`admin.html`)
To view and manage incoming leads:
1. Navigate to `/admin.html`.
2. Sign in using your Supabase Admin credentials (email and password).
3. The dashboard queries the database directly with filters (e.g., Unread status) and sorting orders (Newest, Oldest, Priority).
4. Features available in the dashboard:
   - **Status Toggle**: Check/uncheck requests to mark them as read/unread.
   - **Priority Assignment**: Assign priority tags (`🔴 High`, `🟡 Medium`, `🟢 Low`) directly to leads.
   - **Bulk Deletion**: Delete selected leads permanently.
   - **CSV Export**: Export the currently loaded leads list to a CSV file.

---

## Development & Running Locally

### Option A: Static Frontend + Supabase (Recommended / Active Production)
Since the production setup is serverless, you do not need Node.js to run the client.
1. Simply double-click `index.html` to open it in a browser, or serve it using a lightweight local web server:
   ```bash
   # Using a global npm package to serve static files
   npx serve .
   ```
2. The website will load and communicate directly with the live Supabase cloud database instance (`diaojuumezzritqjifbb.supabase.co`).

### Option B: Node.js + MySQL Fallback
To run the full local environment with the Express server and MySQL database:
1. **Ensure MySQL is running** on your local machine and create a database named `dd_enterprise`.
2. **Create a `.env` file** in the project root:
   ```env
   PORT=3000
   ADMIN_TOKEN=your_secure_api_token
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=dd_enterprise
   
   # Optional SMTP email settings:
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=user@example.com
   SMTP_PASS=password
   EMAIL_TO=leads@ddenterprise.com
   EMAIL_FROM=noreply@ddenterprise.com
   ```
3. **Install dependencies and start the server**:
   ```bash
   npm install
   npm run dev
   ```
4. Access the local website at `http://localhost:3000`.

---

## Codebase File Index

- `index.html` — The main marketing page and quote submission form.
- `admin.html` — The administrative lead dashboard.
- `styles.css` — Modern, custom, responsive stylesheet for the frontend.
- `server.js` — Legacy/Alternative Node.js Express server.
- `database.js` — Legacy/Alternative MySQL connection helper.
- `package.json` — Legacy/Alternative dependencies (`express`, `mysql2`, `nodemailer`, `dotenv`).
- `Assets/` & `Site images/` — Logo, catalogue, and project installation images.
