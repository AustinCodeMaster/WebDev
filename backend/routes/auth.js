const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }
        
        // SQL query to find user by username
        const query = 'SELECT * FROM users WHERE username = ?';
        const users = await db.executeQuery(query, [username]);
        
        // Check if user exists
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        const user = users[0];
        
        // Use bcrypt to compare the password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Return user data (excluding password)
        const { id, username: name, role } = user;
        res.json({
            success: true,
            message: 'Login successful',
            user: { id, username: name, role }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Login failed',
            error: error.message
        });
    }
});

module.exports = router;
