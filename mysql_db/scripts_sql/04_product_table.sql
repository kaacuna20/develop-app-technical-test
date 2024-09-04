CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    brand VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    iva DECIMAL(10, 2) NOT NULL, 
    description TEXT NOT NULL,
    ram_memory INT NOT NULL,
    cpu_speed FLOAT NOT NULL,
    disk_memory INT NOT NULL,
    stock INT,
    is_stock BOOL,
    slug VARCHAR(110) NOT NULL UNIQUE,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE SET NULL,
    CHECK (stock >= 0)
);

CREATE INDEX idx_slug ON products (slug);