const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/items - Get all lost items
router.get('/', async (req, res) => {
    try {
        const items = await db.executeQuery('SELECT * FROM items ORDER BY created_at DESC');
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/items - Add new lost item (from admin)
router.post('/', async (req, res) => {
    try {
        const { name, category, location, date_lost, description, image } = req.body;
        
        const query = `
            INSERT INTO items (name, category, location, date_lost, description, image, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, 1)
        `;
        
        const result = await db.executeQuery(query, [name, category, location, date_lost, description, image]);
        
        res.status(201).json({ 
            message: 'Item added successfully', 
            itemId: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/items/:id - Update item status
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const query = 'UPDATE items SET status = ? WHERE id = ?';
        await db.executeQuery(query, [status, id]);
        
        res.json({ message: 'Item status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/items/:id - Delete item
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = 'DELETE FROM items WHERE id = ?';
        await db.executeQuery(query, [id]);
        
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/items/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await db.getDatabaseStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;