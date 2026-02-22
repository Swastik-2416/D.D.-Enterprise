const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const nodemailer = require('nodemailer');

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Helper: send notification email if SMTP config present
async function sendNotification(submission) {
  const host = process.env.SMTP_HOST;
  if (!host) return; // SMTP not configured

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    } : undefined
  });

  const to = process.env.EMAIL_TO || process.env.SMTP_USER;
  if (!to) return;

  const html = `
    <h3>New Quote Submission</h3>
    <p><strong>Name:</strong> ${escapeHtml(submission.name || '')}</p>
    <p><strong>Company:</strong> ${escapeHtml(submission.company || '')}</p>
    <p><strong>Email:</strong> ${escapeHtml(submission.email || '')}</p>
    <p><strong>Phone:</strong> ${escapeHtml(submission.phone || '')}</p>
    <p><strong>City:</strong> ${escapeHtml(submission.city || '')}</p>
    <p><strong>Project Type:</strong> ${escapeHtml(submission.type || '')}</p>
    <p><strong>Message:</strong><br/>${escapeHtml(submission.message || '').replace(/\n/g, '<br/>')}</p>
    <p><em>Submitted at: ${submission.submittedAt || new Date().toISOString()}</em></p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || (process.env.SMTP_USER || 'no-reply@example.com'),
      to,
      subject: `New quote: ${submission.name || 'Unnamed'}`,
      html
    });
  } catch (err) {
    console.error('Email send failed', err);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const PORT = process.env.PORT || 3000;
const db = require('./database');

// ... (keep email helper)

// Remove old constants
// const DATA_DIR = path.join(__dirname, 'data');
// const DATA_FILE = path.join(DATA_DIR, 'quotes.json');

// if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
// if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');

app.post('/api/quotes', async (req, res) => {
  const payload = req.body || {};
  // basic validation
  if (!payload.name || !payload.phone || !payload.message) {
    return res.status(400).json({ error: 'Missing required fields: name, phone, message' });
  }

  try {
    const result = await db.run(
      `INSERT INTO project_requests (name, company, email, phone, city, type, message) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.name,
        payload.company,
        payload.email,
        payload.phone,
        payload.city,
        payload.type,
        payload.message
      ]
    );

    // Add ID to payload for email
    payload.id = result.id;

    // fire-and-forget email notification
    sendNotification(payload).catch(() => { });

    res.json({ ok: true, id: result.id });
  } catch (err) {
    console.error('Failed to save quote', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Admin: return submissions only if Authorization: Bearer <ADMIN_TOKEN> matches
app.get('/api/quotes', async (req, res) => {
  const token = (process.env.ADMIN_TOKEN || '').trim();
  const auth = (req.headers.authorization || '').trim();

  if (!token || auth !== `Bearer ${token}`) {
    console.log(`Auth Failed. TokenLen: ${token.length}, AuthLen: ${auth.length}`);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { sort, filter } = req.query;
    let sql = 'SELECT * FROM project_requests';
    const params = [];

    // Filter: 'unread'
    if (filter === 'unread') {
      sql += ' WHERE is_read = 0';
    }

    // Sort: 'oldest' vs 'newest' (default)
    if (sort === 'oldest') {
      sql += ' ORDER BY submitted_at ASC';
    } else {
      sql += ' ORDER BY submitted_at DESC';
    }

    const rows = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Failed to read quotes', err);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.patch('/api/quotes/:id', async (req, res) => {
  const token = (process.env.ADMIN_TOKEN || '').trim();
  const auth = (req.headers.authorization || '').trim();
  if (!token || auth !== `Bearer ${token}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { is_read } = req.body;
  if (is_read === undefined) return res.status(400).json({ error: 'Missing is_read' });

  try {
    await db.run('UPDATE project_requests SET is_read = ? WHERE id = ?', [is_read ? 1 : 0, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to update quote', err);
    res.status(500).json({ error: 'Failed to update data' });
  }
});

// Serve static files (so you can open http://localhost:3000/)
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
