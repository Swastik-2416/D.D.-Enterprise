const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'database.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.run(`CREATE TABLE IF NOT EXISTS project_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    company TEXT,
    email TEXT,
    phone TEXT,
    city TEXT,
    type TEXT,
    message TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read INTEGER DEFAULT 0,
    ip_address TEXT
  )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            // Migration: Add ip_address column if it doesn't exist
            db.all("PRAGMA table_info(project_requests)", (err, columns) => {
                if (err) return console.error('Error checking table info:', err.message);
                const hasIp = columns.some(col => col.name === 'ip_address');
                if (!hasIp) {
                    db.run("ALTER TABLE project_requests ADD COLUMN ip_address TEXT", (err) => {
                        if (err) console.error('Error adding ip_address column:', err.message);
                        else console.log('Added ip_address column successfully.');
                    });
                }
            });
        }
    });
}

// Promisify helper for run actions (INSERT, UPDATE, DELETE)
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
}

// Promisify helper for getting all rows (SELECT)
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Promisify helper for getting a single row
function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

module.exports = {
    db,
    run,
    query,
    get
};
