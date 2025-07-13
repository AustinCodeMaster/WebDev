const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/database');

// Import routes
const itemsRoutes = require('./routes/items');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/items', itemsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Aussssssssssssstin!!!!' });
});

// Test database connection route
app.get('/test-db', async (req, res) => {
    try {
        const isConnected = await db.testConnection();
        if (isConnected) {
            res.json({ 
                message: 'Database connection successful!',
                status: 'Connected'
            });
        } else {
            res.status(500).json({ 
                message: 'Database connection failed!',
                status: 'Disconnected'
            });
        }
    } catch (error) {
        res.status(500).json({ 
            message: 'Database connection failed!', 
            error: error.message 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});