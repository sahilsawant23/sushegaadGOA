-- SQL Schema for Sushegaad GOA Platform Database
-- Supports: Travelers, Admin Dashboard, Verified Local Guides, Shack & Restaurant Vendors, Vehicle Fleets & Water Sports

CREATE DATABASE IF NOT EXISTS goa_db;
USE goa_db;

-- 1. Users Master Table (Supports: user, admin, guide, vendor)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'guide', 'vendor') DEFAULT 'user',
  phone VARCHAR(50),
  location VARCHAR(100),
  bio TEXT,
  has_premium_access BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Shack, Restaurant & Vendor Listings Table
CREATE TABLE IF NOT EXISTS vendor_listings (
  id VARCHAR(100) PRIMARY KEY,
  vendor_user_id INT,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- Beach Shack, Restaurant & Dining, Scooter & Car Rental, Water Sports Operator, Artisan Workshop
  location VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  license_number VARCHAR(100),
  capacity_inventory VARCHAR(100),
  documents_json TEXT, -- JSON containing Tourism License, FSSAI Cert, Owner ID, Front Photo
  status ENUM('Pending Review', 'Active', 'Rejected') DEFAULT 'Pending Review',
  rating DECIMAL(3, 2) DEFAULT 5.0,
  active_bookings INT DEFAULT 0,
  revenue_this_month DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Scooter & Car Fleet Rental Bookings Table
CREATE TABLE IF NOT EXISTS rental_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id VARCHAR(100) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  driving_license VARCHAR(100) NOT NULL,
  vehicle_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- Thar 4x4, Creta, Vespa 125, Activa 6G, Himalayan 450
  daily_price DECIMAL(10, 2) NOT NULL,
  rental_days INT NOT NULL,
  pickup_hub VARCHAR(255) NOT NULL,
  pickup_date DATE,
  dropoff_date DATE,
  total_amount DECIMAL(10, 2) NOT NULL,
  deposit DECIMAL(10, 2) DEFAULT 3000.00,
  payment_id VARCHAR(100),
  payment_status VARCHAR(50) DEFAULT 'Paid',
  status ENUM('Confirmed', 'Vehicle Handed Over', 'Completed', 'Cancelled') DEFAULT 'Confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tour & Guide Bookings Table
CREATE TABLE IF NOT EXISTS tour_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id VARCHAR(100) UNIQUE,
  user_id INT,
  guide_id INT,
  tour_title VARCHAR(255) NOT NULL,
  booking_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Confirmed',
  guests INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Verified Local Guides Table
CREATE TABLE IF NOT EXISTS guides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  specialty VARCHAR(255),
  languages VARCHAR(255),
  license_no VARCHAR(100),
  rating DECIMAL(3, 2) DEFAULT 4.9,
  status ENUM('Verified', 'Pending Verification', 'Rejected') DEFAULT 'Verified',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Support & Contact Form Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status ENUM('Unread', 'In Progress', 'Resolved') DEFAULT 'Unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Wishlist / Saved Itineraries Table
CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_id VARCHAR(100) NOT NULL,
  item_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Destinations & Hidden Gems Table
CREATE TABLE IF NOT EXISTS destinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100), -- North, South, Central, Old Goa
  description TEXT,
  category VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
