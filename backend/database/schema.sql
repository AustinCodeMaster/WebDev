-- Lost and Found Application Database Schema

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS lofo_db;
USE lofo_db;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Items table for lost and found items
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    location VARCHAR(100),
    date_lost DATE,
    created_by INT,
    status ENUM('lost', 'found', 'claimed', 'verified', 'pending') DEFAULT 'lost',
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample admin user (password: admin123)
-- Note: In production, use proper password hashing
INSERT INTO users (username, password, role)
VALUES ('admin', '$2b$10$rQDt6GVdxdUiUJApDfh8weyQYLzLYXumAOTKGNoR1yZpDNfaI0JLm', 'admin');

-- Insert sample items
INSERT INTO items (name, description, category, location, date_lost, status)
VALUES 
('Blue Notebook', 'A blue spiral notebook with math notes', 'School Supplies', 'Library', '2025-06-25', 'verified'),
('Black Umbrella', 'Compact folding umbrella with wooden handle', 'Accessories', 'Cafeteria', '2025-06-28', 'lost'),
('USB Drive', '16GB USB drive with red casing', 'Electronics', 'Computer Lab', '2025-06-26', 'found');
