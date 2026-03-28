const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const poolConfig = process.env.DATABASE_URL || {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'dd_enterprise',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(poolConfig);

async function initDb() {
    try {
        const createTableSql = `
            CREATE TABLE IF NOT EXISTS project_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                company VARCHAR(255),
                email VARCHAR(255),
                phone VARCHAR(50),
                city VARCHAR(100),
                type VARCHAR(100),
                message TEXT,
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_read BOOLEAN DEFAULT 0,
                ip_address VARCHAR(45)
            )
        `;
        await pool.query(createTableSql);
        console.log('Connected to MySQL and ensured table exists.');
    } catch (err) {
        if (err.code === 'ECONNREFUSED') {
            console.error('MySQL Connection Refused! Make sure your DATABASE_URL is correct or MySQL is running locally.');
        } else {
            console.error('Error initializing database:', err.message);
        }
    }
}

// Initialize on startup
initDb();

// Promisify helper for run actions (INSERT, UPDATE, DELETE)
async function run(sql, params = []) {
    const [result] = await pool.execute(sql, params);
    return { id: result.insertId, changes: result.affectedRows };
}

// Promisify helper for getting all rows (SELECT)
async function query(sql, params = []) {
    const [rows] = await pool.query(sql, params);
    return rows;
}

// Promisify helper for getting a single row
async function get(sql, params = []) {
    const [rows] = await pool.query(sql, params);
    return rows[0];
}

module.exports = {
    pool,
    run,
    query,
    get
};
