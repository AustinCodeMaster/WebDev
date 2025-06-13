const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'skahush254', // Update with your MySQL root password
  database: 'lofo_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
    connection.release();
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('LoFo Lost and Found API is running');
});

// User login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  pool.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      const user = results[0];
      // For simplicity, plain text password comparison (should use hashing in production)
      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      // Return user info (in production, return JWT token)
      res.json({ id: user.id, username: user.username, role: user.role });
    }
  );
});

// Get lost items
app.get('/lost-items', (req, res) => {
  pool.query('SELECT * FROM lost_items WHERE status = "lost"', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json(results);
  });
});

  
// Student claims an item
app.post('/claim', (req, res) => {
  const { user_id, lost_item_id } = req.body;
  if (!user_id || !lost_item_id) {
    return res.status(400).json({ message: 'user_id and lost_item_id are required' });
  }
  const sql = 'INSERT INTO claims (user_id, lost_item_id) VALUES (?, ?)';
  pool.query(sql, [user_id, lost_item_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'Claim submitted successfully', claimId: result.insertId });
  });
});

// Admin views claims
app.get('/claims', (req, res) => {
  const sql = `
    SELECT c.id, u.username, li.title, c.claim_date, c.status
    FROM claims c
    JOIN users u ON c.user_id = u.id
    JOIN lost_items li ON c.lost_item_id = li.id
  `;
  pool.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json(results);
  });
});

// Admin adds lost item
app.post('/lost-items', (req, res) => {
  const { title, category, location, date_lost, description, image_url } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  const sql = `
    INSERT INTO lost_items (title, category, location, date_lost, description, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  pool.query(sql, [title, category, location, date_lost, description, image_url], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'Lost item added successfully', itemId: result.insertId });
  });
});

// Admin updates lost item
app.put('/lost-items/:id', (req, res) => {
  const itemId = req.params.id;
  const { title, category, location, date_lost, description, image_url, status } = req.body;
  const sql = `
    UPDATE lost_items
    SET title = ?, category = ?, location = ?, date_lost = ?, description = ?, image_url = ?, status = ?
    WHERE id = ?
  `;
  pool.query(sql, [title, category, location, date_lost, description, image_url, status, itemId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'Lost item updated successfully' });
  });
});

// Admin deletes lost item
app.delete('/lost-items/:id', (req, res) => {
  const itemId = req.params.id;
  const sql = 'DELETE FROM lost_items WHERE id = ?';
  pool.query(sql, [itemId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'Lost item deleted successfully' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
