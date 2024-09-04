CREATE TABLE IF NOT EXISTS images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    color VARCHAR(50) NOT NULL,
    main_image_url VARCHAR(300) NOT NULL,
    second_image_url VARCHAR(300) NOT NULL,
    third_image_url VARCHAR(300) NOT NULL,
    fourth_image_url VARCHAR(300) NOT NULL,
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL
);

CREATE INDEX idx_product_id ON images(product_id);