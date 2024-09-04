from sqlalchemy import Column, Integer, String, Boolean, DECIMAL, Text, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from slugify import slugify
from database import Base


class Order(Base):
    __tablename__ = 'orders'

    order_id = Column(String(36), primary_key=True, unique=True)
    user_id = Column(String(36), ForeignKey('users.user_id', ondelete='CASCADE'))
    fullname = Column(String(100), nullable=False)
    phone = Column(String(10), nullable=False)
    address = Column(String(50), nullable=False)
    city = Column(String(50), nullable=False)
    zip_code = Column(String(20))
    shipments = Column(Integer, nullable=False)
    order_date = Column(DateTime, default=func.now())    
    quantity = Column(Integer)
    total = Column(DECIMAL(10, 2), nullable=False)

    user = relationship("User", back_populates="orders")

    order_products = relationship("OrderProduct", back_populates="order")

    def __repr__(self):
        return f'<Order {self.order_id}>'


class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(String(36), primary_key=True, unique=True)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(200), nullable=False)
    username = Column(String(100), unique=True, nullable=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    register_date = Column(DateTime, default=func.now())
    
    orders = relationship("Order", back_populates="user")
    
    def __repr__(self):
        return f'<User {self.username}>'


class OrderProduct(Base):
    __tablename__ = 'order_product'

    order_product_id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(String(36), ForeignKey('orders.order_id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.product_id'), nullable=False)
    quantity = Column(Integer)

    order = relationship("Order", back_populates="order_products")

    product = relationship("Product", back_populates="order_products")

    def __repr__(self):
        return f'<OrderProduct {self.order_product_id}>'


class Product(Base):
    __tablename__ = 'products'
    
    product_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    brand = Column(String(100), nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)
    iva = Column(DECIMAL(10, 2), nullable=False)
    description = Column(Text, nullable=False)
    ram_memory = Column(Integer, nullable=False)
    cpu_speed = Column(Float, nullable=False)
    disk_memory = Column(Integer, nullable=False)
    stock = Column(Integer)
    is_stock = Column(Boolean)
    slug = Column(String(110), unique=True, nullable=False, index=True)
    category_id = Column(Integer, ForeignKey('category.category_id'), nullable=False)

    category = relationship("Category", back_populates="products")

    order_products = relationship("OrderProduct", back_populates="product")
    
    image = relationship('Image', uselist=False, back_populates='product')

    def __init__(self, name, *args, **kwargs):
        super(Product, self).__init__(*args, **kwargs)
        self.name = name
        self.slug = slugify(self.name)  # Generate slug on object creation

    def __repr__(self):
        return f'<Product {self.name}>'
    

class Image(Base):
    __tablename__ = 'images'
    
    image_id = Column(Integer, primary_key=True, autoincrement=True)
    main_image_url = Column(String(300), nullable=False)
    second_image_url = Column(String(300), nullable=True)
    third_image_url = Column(String(300), nullable=True)
    fourth_image_url = Column(String(300), nullable=True)
    product_id = Column(Integer, ForeignKey('products.product_id', ondelete='SET NULL'), unique=True)
    
    product = relationship('Product', back_populates='image')
    
   

class Category(Base):
    __tablename__ = "category"
    
    category_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    
    products = relationship("Product", back_populates="category")

    def __repr__(self):
        return f'<Category {self.name}>'




