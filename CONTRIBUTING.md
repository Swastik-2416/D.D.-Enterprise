# Contributing to D.D. Enterprise Web Portal

Thank you for your interest in contributing to D.D. Enterprise. This guide outlines how to set up the project locally, propose changes, and contribute to our codebase.

---

## 1. System Overview & Technology Stack

The active production website is **entirely serverless** and runs on static hosting platforms (like GitHub Pages).
- **Active Stack**: HTML5, Vanilla CSS3, Client-side ES6 JavaScript, and **Supabase** for Backend-as-a-Service (PostgreSQL database and Admin Authentication).
- **Development/Alternative Stack**: Node.js + Express + MySQL. Used primarily for local validation or as a self-hosted alternative.

---

## 2. Local Development Setup

### A. Static & Supabase Setup (Primary / Production Method)
Because the site is serverless, you do *not* need Node.js or a local database server for daily frontend development.
1. Fork and clone the repository.
2. Open `index.html` directly in your browser or run a simple local HTTP server from the project root:
   ```bash
   npx serve .
   ```
3. Make changes to the static files (`index.html`, `admin.html`, `styles.css`).
4. Since the keys are configured in the client script, your local client will communicate directly with the development Supabase cloud database instance. *Note: Ensure you do not expose any private Supabase service role keys.*

### B. Full Stack Setup (Node.js + MySQL Fallback Method)
If you are developing or testing the local backend fallback features:
1. Ensure **MySQL** is running locally and database `dd_enterprise` exists.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the configuration template into a new `.env` file (see `README.md` for environment variables).
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Test page loading at `http://localhost:3000` and admin functions at `http://localhost:3000/admin.html`.

---

## 3. Workflow for Submitting Changes

1. **Create a Branch**: Create a topic branch off of the main branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Implement Changes**:
   - Write clean, semantic HTML5.
   - Style using vanilla CSS (variables are declared in `:root` in `styles.css`).
   - Use standard ES6 Javascript. Avoid adding heavy client-side libraries.
3. **Manual Verification**:
   - Verify the form submissions work correctly by checking `localStorage` (`dd_quotes`) and the Supabase table inserts.
   - Verify `admin.html` dashboard filters, status toggles, priority selection, deletion, and CSV export.
   - Test screen responsiveness across mobile, tablet, and desktop viewports.
4. **Commit & Push**:
   - Write descriptive commit messages.
   - Push your topic branch and open a Pull Request.

---

## 4. Coding & Architecture Guidelines

- **No Server Node.js Dependencies in Client**: Never import `npm` node modules in browser code. Always load external assets via reliable CDNs (like jsDelivr) if absolutely required.
- **Error Handling**: Form submissions must fail gracefully. If the Supabase CDN fails to load or database queries throw an error, alert the user and instruct them to contact D.D. Enterprise via phone or WhatsApp, while backing up the data in `localStorage`.
- **Database Schema Integrity**: If you propose database changes, ensure they are updated in the Supabase schema, the local MySQL creation logic inside `database.js`, and documented in `DOCUMENTATION.md`.

