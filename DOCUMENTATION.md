# Full Project Documentation — D.D. Enterprise

This document provides a detailed, technical explanation of the architecture, database schemas, frontend pages, and integration flows of the D.D. Enterprise web application.

---

## 1. System Architecture

The D.D. Enterprise website uses a dual-path architecture designed to run as a serverless static site in production (backed by Supabase), while maintaining a local Node.js + MySQL stack for local development and fallback capability.

```
                  ┌─────────────────────────────────────┐
                  │          Client Browser             │
                  └──────────────┬──────────────┬───────┘
                                 │              │
                    (Primary Path)              │ (Fallback Path)
                                 ▼              ▼
                    ┌─────────────────┐    ┌─────────────────┐
                    │    Supabase     │    │   Local Node    │
                    │  Cloud Backend  │    │  Express Server │
                    └────────┬────────┘    └────────┬────────┘
                             │                      │
                             ▼                      ▼
                    ┌─────────────────┐    ┌─────────────────┐
                    │   PostgreSQL    │    │      MySQL      │
                    │    Database     │    │    Database     │
                    └─────────────────┘    └─────────────────┘
```

- **Active Production (Serverless)**: 
  - Frontend is served statically (e.g., GitHub Pages).
  - All form submissions are sent directly to **Supabase** via the client-side JavaScript SDK.
  - The Admin UI authenticates users and performs operations directly against Supabase.
- **Development/Fallback**:
  - The client attempts to initialize the Supabase client. If it fails to load or connect (e.g. adblocker, network restrictions), form submissions fallback to hitting the local REST API (`/api/quotes`) hosted by the Node.js/Express server.

---

## 2. Database Schema (`project_requests` Table)

Both database backends (Supabase PostgreSQL and Local MySQL) store enquiries in the `project_requests` table.

### Supabase (PostgreSQL) Schema
| Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` (int8) | Primary Key, Identity | Unique lead identifier |
| `name` | `text` | Not Null | Lead's full name |
| `phone` | `text` | Not Null | Mobile number |
| `email` | `text` | Nullable | Email address |
| `city` | `text` | Nullable | Project city/location |
| `type` | `text` | Nullable | Paver/Tile type + selected thickness |
| `message` | `text` | Nullable | Additional notes and estimated pieces data |
| `submitted_at` | `timestamp with time zone` | `now()` | Date and time submitted |
| `is_read` | `boolean` | `false` | Read status |
| `priority` | `text` | `'medium'` | Action priority: `'high'`, `'medium'`, `'low'` |

### Local MySQL Schema (Created dynamically by `database.js`)
| Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | AUTO_INCREMENT, Primary Key | Unique lead identifier |
| `name` | `VARCHAR(255)` | - | Lead's full name |
| `company` | `VARCHAR(255)` | - | (Legacy support) |
| `email` | `VARCHAR(255)` | - | Email address |
| `phone` | `VARCHAR(50)` | - | Mobile number |
| `city` | `VARCHAR(100)` | - | Project city/location |
| `type` | `VARCHAR(100)` | - | Selected product configuration |
| `message` | `TEXT` | - | Form message + calculated pieces |
| `submitted_at` | `DATETIME` | `CURRENT_TIMESTAMP` | Date and time submitted |
| `is_read` | `BOOLEAN` | `0` (false) | Read status |
| `ip_address` | `VARCHAR(45)` | - | Submitter's IP address (for rate limiting) |

---

## 3. Frontend Implementation & Integration

### A. Customer Website (`index.html`)
- **Supabase CDN**: Loads SDK via `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>`.
- **Client Initialization**:
  ```javascript
  const _supabaseUrl = 'https://diaojuumezzritqjifbb.supabase.co';
  const _supabaseKey = 'sb_publishable_y7k4oyOT4x3kFETDyBOndA_kxbkgdi3';
  const dbClient = (window.supabase && window.supabase.createClient) 
                   ? window.supabase.createClient(_supabaseUrl, _supabaseKey) 
                   : null;
  ```
- **Quote Form Handler (`#quoteForm`)**:
  1. Captcha validation.
  2. Construction of description: Combines paver selection and thickness into the `type` string.
  3. Appends dynamic calculator estimates (sq.ft/sq.mt converted area and estimated piece count) to the bottom of the `message`.
  4. If `dbClient` is initialized, it issues an asynchronous `.insert()` directly to Supabase.
  5. If `dbClient` is unavailable, it issues a `fetch('/api/quotes')` `POST` request to the local server.
  6. Backs up the payload to `localStorage` under `dd_quotes` for redundancy.

### B. Admin Lead Manager (`admin.html`)
- **Authentication (Supabase Auth)**:
  - When `supabaseClient` is active, the dashboard shows a login form for administrators.
  - Authenticates via `supabaseClient.auth.signInWithPassword({ email, password })`.
  - Once signed in, it displays the administrator's email and loads lead details.
  - To secure data, Row Level Security (RLS) policies should be enabled in the Supabase Console, restricting read/write access to authenticated users.
- **Operations (Supabase vs Fallback Local Server)**:
  - **Read**: Fetches list using `supabaseClient.from('project_requests').select('*')` with sorting and read/unread filters. If serverless is inactive, requests `GET /api/quotes` with `Authorization: Bearer <token>`.
  - **Toggle Status**: Marks read/unread by executing an `.update({ is_read })` query.
  - **Update Priority**: Changes priority tags directly (`'high'`, `'medium'`, `'low'`).
  - **Delete Leads**: Performs bulk-delete on selected item IDs using `.delete().in('id', selected)`.
  - **Export CSV**: Locally parses the loaded table data and triggers a browser CSV file download.

---

## 4. Legacy Backend REST API Endpoints

When the local Express server is active, it runs on port `3000` (or `PORT`) and exposes these endpoints:

### `POST /api/quotes`
- **Access**: Public.
- **Payload**: `{ name, email, phone, city, type, message }`
- **Actions**:
  1. Checks request IP using `req.headers['x-forwarded-for']` or `req.socket.remoteAddress`.
  2. Restricts to a maximum of 10 submissions per IP (`ip_address`).
  3. Inserts lead into the local MySQL database.
  4. Fires SMTP notification email asynchronously if configured.

### `GET /api/quotes`
- **Access**: Protected. Requires `Authorization: Bearer <ADMIN_TOKEN>`.
- **Query Params**:
  - `filter`: Set to `unread` to load unread entries only.
  - `sort`: Set to `oldest` for ascending submission dates; defaults to newest first.
- **Response**: Array of JSON lead objects.

### `PATCH /api/quotes/:id`
- **Access**: Protected. Requires `Authorization: Bearer <ADMIN_TOKEN>`.
- **Payload**: `{ is_read: boolean }`
- **Action**: Updates `is_read` status in database.

### `DELETE /api/quotes`
- **Access**: Protected. Requires `Authorization: Bearer <ADMIN_TOKEN>`.
- **Payload**: `{ ids: [number] }` (Array of ID values to delete).
- **Action**: Bulk deletes matching IDs.