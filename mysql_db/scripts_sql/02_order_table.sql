CREATE TABLE IF NOT EXISTS orders (
    order_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    fullname VARCHAR(100) NOT NULL,
    phone VARCHAR(10) NOT NULL,
    address VARCHAR(50) NOT NULL, 
    city VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20),
    shipments INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantity INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
