from pydantic import BaseModel, Field
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import get_db
from models import *
from fastapi import Request, Depends
from routers.auth import  get_current_user
from uuid import uuid4


router = APIRouter(
    prefix='/order',
    tags=['order-handle']
)

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class OrderForm(BaseModel):
    fullname: str = Field(min_length=1, max_length=100)
    phone: str = Field(min_length=10, max_length=10)
    address: str = Field(min_length=1, max_length=50)
    city: str = Field(min_length=1, max_length=50)
    zip_code: Optional[str] = None
    shipments: int = Field(ge=0)   

@router.get("/checkout/", status_code=status.HTTP_200_OK)
async def get_order(request: Request, db: db_dependency, user: user_dependency):
    
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    
    cart = request.session.get("cart")
    try:
        buy_cart = []
        for id, quantity in cart.items():
            product = db.query(Product, Image).join(Image).filter(Product.product_id == int(id)).first()
            buy_cart.append(
       {   "product_id": product[0].product_id,
                        "name": product[0].name,
                        "brand": product[0].brand,
                        "price": float(product[0].price),
                        "iva": float(product[0].iva),
                        "image_url":product[1].main_image_url,
                        "quantity": quantity,
                        "total": float(quantity*(product[0].iva + product[0].price))
                    }
            )
        
        sum_prices = sum([item["total"] for item in buy_cart])
        total_quantity = sum([item["quantity"] for item in buy_cart])
        
        # Retrieve checkout from session
        checkout = request.session.get("checkout")
        # Ensure checkout is a dictionary
        if not isinstance(checkout, dict):
            checkout = {}
        
        checkout = {
            "total_price": float(sum_prices),
            "total_devices": total_quantity,
            "devices": buy_cart
            }
        
        request.session['checkout'] = checkout
        
        return {"response": checkout}
    
    except Exception as ex:
      
        print(ex)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred.")

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_order(db: db_dependency, request: Request, order_form: OrderForm, user: user_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    
    checkout = request.session.get("checkout")
    print(checkout)
    if checkout is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No checkout data found in session")
    #try:  
    total = checkout["total_price"] + order_form.shipments
    total_quantity = checkout["total_devices"]
    order_id = str(uuid4())  # Use string format for consistency
   
    order = Order(
            order_id=order_id,
            user_id=user["id"],
            fullname=order_form.fullname.lower(),
            phone=order_form.phone,
            address=order_form.address.lower(),
            city=order_form.city.lower(),
            zip_code=order_form.zip_code,
            shipments=order_form.shipments,
            quantity=total_quantity,
            total=total
        )
    db.add(order)
    db.commit()
    
  
        # Save order_product in the database
    for product_data in checkout["devices"]:
            order_product_table = OrderProduct(
                order_id=order_id,
                product_id=product_data["product_id"],
                quantity=product_data["quantity"]
            )
            db.add(order_product_table)
            
            # Update stock
            product = db.query(Product).filter(Product.product_id == product_data["product_id"]).first()
            if product.stock < product_data["quantity"]:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Not enough stock for product {product.name}")
            new_stock = product.stock - product_data["quantity"]
            product.stock = new_stock
            
        
    db.commit()
  
        # Clear the session
    request.session.pop("cart", None)
    request.session.pop("checkout", None)

    return {"order_id": order_id}
    # except Exception as ex:
      
    #     print(ex)
    #     raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred.")


@router.get("/details/{order_id}", status_code=status.HTTP_200_OK)
async def get_order_details(db: db_dependency, user: user_dependency, order_id: str):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    
    # Obtener la orden y productos asociados
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    # Obtener los productos asociados a la orden
    products_by_order = (
        db.query(Product, OrderProduct.quantity, Image)
        .join(OrderProduct, OrderProduct.product_id == Product.product_id).join(Image)
        .filter(OrderProduct.order_id == order_id)
        .all()
    )
    
    if not products_by_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No products found for this order")
    
    # Construir la lista de productos
    products_list = []
    for product, quantity, image in products_by_order:
        product_data = {
            "product_id": product.product_id,
            "name": product.name,
            "brand": product.brand,
            "price": product.price,
            "quantity": quantity,
            "image_url": image.main_image_url
        }
        products_list.append(product_data)
    
    # Construir la respuesta
    response = {
        "fullname": order.fullname,
        "address": order.address,
        "phone": order.phone,
        "city": order.city, 
        "products": products_list,
        "shipments": order.shipments,
        "total": order.total
    }
    
    return response


