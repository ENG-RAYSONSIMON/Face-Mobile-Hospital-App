CREATE DATABASE IF NOT EXISTS face_hospital;
USE face_hospital;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'doctor') NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  age INT NOT NULL,
  phone VARCHAR(25),
  address VARCHAR(255),
  diagnosis TEXT,
  doctor_name VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medicine_name VARCHAR(120) NOT NULL,
  category VARCHAR(60),
  quantity INT NOT NULL DEFAULT 0,
  unit_price DECIMAL(10, 2) NOT NULL,
  expiry_date DATE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drug_sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stock_id INT NOT NULL,
  quantity INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  sold_by VARCHAR(120),
  sold_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sales_stock FOREIGN KEY (stock_id) REFERENCES stock(id)
);

-- Seed user passwords are bcrypt hashes.
-- admin123 -> $2y$12$KXmCcq9nTZHhqWkicxG/NeA7N57sT3mWkn5pxiDVRunRSt59lGswu
-- doctor123 -> $2y$12$Hjevl4UfIPr3pdNgPKuU8uubs7KYhH0jWkrMb3srss9fMAVhvnMyS
INSERT INTO users (username, full_name, role, password_hash)
VALUES
  ('admin', 'System Admin', 'admin', '$2y$12$KXmCcq9nTZHhqWkicxG/NeA7N57sT3mWkn5pxiDVRunRSt59lGswu'),
  ('doctor', 'Staff Doctor', 'doctor', '$2y$12$Hjevl4UfIPr3pdNgPKuU8uubs7KYhH0jWkrMb3srss9fMAVhvnMyS')
ON DUPLICATE KEY UPDATE username = VALUES(username);
