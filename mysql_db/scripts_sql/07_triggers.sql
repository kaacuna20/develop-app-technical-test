DELIMITER //

CREATE TRIGGER calculate_iva
BEFORE INSERT ON products
FOR EACH ROW
BEGIN
    SET NEW.iva = NEW.price * 0.19;
END //

CREATE TRIGGER calculate_iva_update
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    SET NEW.iva = NEW.price * 0.19;
END //

DELIMITER ;


DELIMITER //

CREATE TRIGGER create_is_stock_on_update
BEFORE INSERT ON products
FOR EACH ROW
BEGIN
    IF NEW.stock <= 0 THEN
        SET NEW.is_stock = FALSE;
    ELSE
        SET NEW.is_stock = TRUE;
    END IF;
END //


CREATE TRIGGER update_is_stock_on_update
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    IF NEW.stock <= 0 THEN
        SET NEW.is_stock = FALSE;
    ELSE
        SET NEW.is_stock = TRUE;
    END IF;
END //

DELIMITER ;