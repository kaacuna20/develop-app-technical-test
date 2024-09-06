from pydantic import BaseModel, Field
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import get_db
from fastapi import File, UploadFile
from models import *
from typing import Optional
import os
from routers.auth import admin_access
from routers.csfr_token import csrf_dependency
from database import db_dependency


router = APIRouter(
    prefix='/admin',
    tags=['admin-actions']
)


class CreateProductRequest(BaseModel):
    name: str
    brand: str
    price: int = Field(gt=0)
    description: str
    ram_memory: int = Field(gt=0)
    cpu_speed: float = Field(gt=0)
    disk_memory: int = Field(gt=0)
    stock: int = Field(gt=0)
    category_id: int = Field(gt=0)

class UpdateProductRequest(BaseModel):
    price: int = Field(gt=0)
    stock: int = Field(gt=0)
    category_id: int = Field(gt=0)
    

admin_dependency = Annotated[dict, Depends(admin_access)]

@router.get("/protected-route/", status_code=status.HTTP_200_OK)
async def admin(user: admin_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    return user

@router.get("/all-users/", status_code=status.HTTP_200_OK)
async def get_all_users(db: db_dependency, admin: admin_dependency):
    if admin is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access Denied")
    users = db.query(User).all()
    return {"users_registered":users}

@router.get("/all-orders/", status_code=status.HTTP_200_OK)
async def get_all_orders(db: db_dependency, admin: admin_dependency):
    if admin is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access Denied")
    orders = db.query(Order).all()
    return {"orders":orders}

@router.get("/order-products/", status_code=status.HTTP_200_OK)
async def get_order_products(
    db: db_dependency,
    admin: admin_dependency,
    order_id: Optional[str] = None,
    product_id: Optional[int] = None,
):
    if admin is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access Denied")
    
    query = db.query(OrderProduct, Order, Product) \
    .join(Order, Order.order_id == OrderProduct.order_id) \
    .join(Product, Product.product_id == OrderProduct.product_id)

    if order_id is not None:
        query = query.filter(OrderProduct.order_id == order_id)
    if product_id is not None:
        query = query.filter(OrderProduct.product_id == product_id)
    
    order_products = query.all()
    
    if not order_products:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No order products found.")
    
    full_info = []
    for order_product, order, product in order_products:
        full_info.append({
            "user": [
                {"username":order.user.username}, 
                {"email":order.user.email}
                ],
            "buyer": [
                {"fullname":order.fullname},
                {"phone":order.phone},
                {"address":order.address},
                {"city":order.city}
                ],
            "product": [
                {"product-id":product.product_id},
                {"name":product.name},
                {"brand":product.brand},
                {"price":product.price},
                {"quantity":order_product.quantity}#,
                ],
            "order": [
                {"order-id":order.order_id},
                {"date":order.order_date},
                {"shipment":order.shipments}, 
                {"total_products":order.quantity},
                {"total_amount": order.total}
                ],
        })

    return {"response":full_info}

@router.post("/create-category/", status_code=status.HTTP_201_CREATED)
async def create_category(db: db_dependency, admin: admin_dependency, category:str, csrf_token: csrf_dependency):
    
    if admin is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access Denied")
    
    try:
        create_category = Category(
            name = category.lower(),
        )
        db.add(create_category)
        db.commit()
        return {"category_created": category}
    except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail='This category is already registered'
                )


@router.post("/create-product/", status_code=status.HTTP_201_CREATED)
async def create_product(
    db: db_dependency, 
    admin: admin_dependency, 
    create_product_request: CreateProductRequest, 
    csrf_token: csrf_dependency
    ):
    
    if admin is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access Denied")
    
    try:
        create_product = Product(
            name = create_product_request.name.lower(),
            brand = create_product_request.brand.lower(),
            price = create_product_request.price,
            description = create_product_request.description,
            ram_memory = create_product_request.ram_memory,
            cpu_speed = create_product_request.cpu_speed,
            disk_memory = create_product_request.disk_memory,
            stock = create_product_request.stock,
            category_id = create_product_request.category_id
        )
        db.add(create_product)
        db.commit()
        return {"category_created": "Product created sucessfull"}
    except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail='This name of product is already registered'
                )
            
UPLOAD_DIR = "images"

@router.post("/upload-images/", status_code=status.HTTP_200_OK)
async def upload_images(
        db: db_dependency, 
        admin: admin_dependency,
        csrf_token: csrf_dependency,
        product_id: int, 
        main_image_url: Annotated[UploadFile, File()],
        second_image_url: Annotated[UploadFile, File()],
        third_image_url: Annotated[UploadFile, File()],
        fourth_image_url: Annotated[UploadFile, File()]
    ):
    
    if admin is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access Denied")

    list_files = [
        os.path.normpath(os.path.join(UPLOAD_DIR, str(product_id), main_image_url.filename.strip())).replace('\\', '/'), 
        os.path.normpath(os.path.join(UPLOAD_DIR, str(product_id), second_image_url.filename.strip())).replace('\\', '/'),
        os.path.normpath(os.path.join(UPLOAD_DIR, str(product_id), third_image_url.filename.strip())).replace('\\', '/'),
        os.path.normpath(os.path.join(UPLOAD_DIR, str(product_id), fourth_image_url.filename.strip())).replace('\\', '/')
        ]
    
 # Process each file
    for i, file in enumerate([main_image_url, second_image_url, third_image_url, fourth_image_url]):
        file_path = list_files[i]
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        try:
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving file {file.filename}: {e}")

    image = Image(
      
            main_image_url=list_files[0],
            second_image_url=list_files[1],
            third_image_url=list_files[2],
            fourth_image_url=list_files[3],
            product_id=product_id
    )
    db.add(image)
    db.commit()

    return {"file_paths": "files updates successfuly!"}


@router.put("/update-category/{category_id}", status_code=status.HTTP_200_OK)
async def change_category(
    db: db_dependency, 
    admin: admin_dependency, 
    csrf_token: csrf_dependency,
    category_id: int, 
    new_name: str
    ):
    
    if admin is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access Denied")
    
    category = db.query(Category).filter(Category.category_id == category_id).first()
    if category:
        category.name = new_name.lower()
        db.commit()
        return {"response": "category was changed successfuly!"}
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sorry, a category with that id was not found in the database.")
    
@router.put("/update-products-items/{product_id}/", status_code=status.HTTP_200_OK)
async def update_items_product(
    db: db_dependency, 
    admin: admin_dependency,
    csrf_token: csrf_dependency, 
    product_id: int, 
    update_product: UpdateProductRequest
    ):
    
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if admin is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access Denied")
    if product:
        product.price = update_product.price
        product.stock = update_product.stock
        product.category_id = update_product.category_id
        
        db.commit()
        
        return {"response": "product was modified successfuly!"}

    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sorry, a product with that id was not found in the database.")
    

@router.delete("/delete-category/{category_id}", status_code=status.HTTP_200_OK)
async def delete_category(
    db: db_dependency, admin: admin_dependency, 
    csrf_token: csrf_dependency, 
    category_id: int
    ):
    if admin is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access Denied")
    category = db.query(Category).filter(Category.category_id == category_id).first()
    if category:
        db.delete(category)
        db.commit()
        return {"response": "category was deleted successfuly!"}
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sorry, a category with that id was not found in the database.")
    
@router.put("/update-state-user/{user_id}", status_code=status.HTTP_200_OK)
async def change_category(
    db: db_dependency, 
    admin: admin_dependency,
    csrf_token: csrf_dependency, 
    user_id: str, 
    new_state: bool
    ):
    
    if admin is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access Denied")
    
    user = db.query(User).filter(User.user_id == user_id).first()
    if user:
        user.is_active = new_state
        db.commit()
        return {"response": "state user was changed successfuly!"}
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sorry, a user with thta id was not found.")