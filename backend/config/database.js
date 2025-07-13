// Database configuration for Lost and Found application
// MySQL connection settings

const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lofo_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// Initialize database tables (run schema if needed)
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // Check if items table exists
        const [tables] = await connection.execute(
            "SHOW TABLES LIKE 'items'"
        );
        
        if (tables.length === 0) {
            console.log('📋 Items table not found. Please run the schema.sql file to create the database structure.');
            console.log('Command: mysql -u root -p lost_and_found < Backend/database/schema.sql');
        } else {
            console.log('✅ Database tables are ready');
        }
        
        connection.release();
    } catch (error) {
        console.error('❌ Error checking database structure:', error.message);
    }
}

// Get database statistics
async function getDatabaseStats() {
    try {
        const connection = await pool.getConnection();
        
        const [totalItems] = await connection.execute(
            'SELECT COUNT(*) as count FROM items'
        );
        
        const [verifiedItems] = await connection.execute(
            'SELECT COUNT(*) as count FROM items WHERE status = "verified"'
        );
        
        const [claimedItems] = await connection.execute(
            'SELECT COUNT(*) as count FROM items WHERE status = "claimed"'
        );
        
        const [foundItems] = await connection.execute(
            'SELECT COUNT(*) as count FROM items WHERE status = "found"'
        );
        
        connection.release();
        
        return {
            total: totalItems[0].count,
            verified: verifiedItems[0].count,
            claimed: claimedItems[0].count,
            found: foundItems[0].count
        };
    } catch (error) {
        console.error('Error getting database stats:', error.message);
        return { total: 0, verified: 0, claimed: 0, found: 0 };
    }
}

// Execute query with error handling
async function executeQuery(query, params = []) {
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute(query, params);
        connection.release();
        return results;
    } catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
}

module.exports = {
    pool,
    testConnection,
    initializeDatabase,
    getDatabaseStats,
    executeQuery
};
