const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');

// GET /api/users - Retrieve all users
router.get('/', async (req, res) => {
    try {
        // SQL query to get all users (excluding passwords for security)
        const query = `
            SELECT id, username, role, created_at
            FROM users
            ORDER BY id
        `;
        
        // Execute the query
        const users = await db.executeQuery(query);
        
        res.json({
            success: true,
            users: users
        });
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to retrieve users',
            error: error.message
        });
    }
});

// GET /api/users/:id - Retrieve a specific user by ID
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        // SQL query to get a specific user (excluding password)
        const query = `
            SELECT id, username, role, created_at
            FROM users
            WHERE id = ?
        `;
        
        // Execute the query with the user ID parameter
        const user = await db.executeQuery(query, [userId]);
        
        // Check if user exists
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            user: user[0]
        });
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to retrieve user',
            error: error.message
        });
    }
});

// POST /api/users - Create a new user
router.post('/', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }
        
        // Check if username already exists
        const checkQuery = 'SELECT id FROM users WHERE username = ?';
        const existingUser = await db.executeQuery(checkQuery, [username]);
        
        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Username already exists'
            });
        }
        
        // Hash the password before storing it
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // SQL query to insert new user
        const insertQuery = `
            INSERT INTO users (username, password, role)
            VALUES (?, ?, ?)
        `;
        
        // Execute the query with parameters
        const result = await db.executeQuery(insertQuery, [
            username, 
            hashedPassword,
            role || 'user'
        ]);
        
        // Get the inserted user (excluding password)
        const newUser = await db.executeQuery(
            'SELECT id, username, role, created_at FROM users WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: newUser[0]
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create user',
            error: error.message
        });
    }
});

// PUT /api/users/:id - Update a user
router.put('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, role } = req.body;
        
        // Check if user exists
        const checkQuery = 'SELECT id FROM users WHERE id = ?';
        const existingUser = await db.executeQuery(checkQuery, [userId]);
        
        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Build update fields dynamically based on what was provided
        const updateFields = [];
        const queryParams = [];
        
        if (username) {
            updateFields.push('username = ?');
            queryParams.push(username);
        }
        
        if (role) {
            updateFields.push('role = ?');
            queryParams.push(role);
        }
        
        // If no fields to update, return early
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields provided for update'
            });
        }
        
        // Add user ID to params array
        queryParams.push(userId);
        
        // SQL query to update user
        const updateQuery = `
            UPDATE users
            SET ${updateFields.join(', ')}
            WHERE id = ?
        `;
        
        // Execute the query
        await db.executeQuery(updateQuery, queryParams);
        
        // Get the updated user
        const updatedUser = await db.executeQuery(
            'SELECT id, username, role, created_at FROM users WHERE id = ?',
            [userId]
        );
        
        res.json({
            success: true,
            message: 'User updated successfully',
            user: updatedUser[0]
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update user',
            error: error.message
        });
    }
});

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Check if user exists
        const checkQuery = 'SELECT id FROM users WHERE id = ?';
        const existingUser = await db.executeQuery(checkQuery, [userId]);
        
        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // SQL query to delete user
        const deleteQuery = 'DELETE FROM users WHERE id = ?';
        
        // Execute the query
        await db.executeQuery(deleteQuery, [userId]);
        
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete user',
            error: error.message
        });
    }
});

module.exports = router;
