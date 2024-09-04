CREATE TABLE IF NOT EXISTS order_product (
    order_product_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id CHAR(36),
    product_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    UNIQUE (order_id, product_id)
);
