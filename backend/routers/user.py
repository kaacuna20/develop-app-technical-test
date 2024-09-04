from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import get_db
from models import *
from fastapi import Depends
from routers.auth import  get_current_user



router = APIRouter(
    prefix='/user',
    tags=['user-profile']
)

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/profile/", status_code=status.HTTP_200_OK)
async def profile(db: db_dependency, user: user_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    
    try:
        user_profile = db.query(User).filter(User.user_id == user["id"]).first()
        
        if user_profile:
            return user_profile
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="user not found")
        
    except Exception as ex:
      
        print(ex)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred.")


@router.get("/history-orders/", status_code=status.HTTP_200_OK)
async def history_orders(db: db_dependency, user: user_dependency):
    
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    
    try:
        orders = db.query(Order).filter(Order.user_id == user["id"]).all()
        
        history_orders = []
        
        for order in orders:
     
            order_history = db.query(OrderProduct, Order, Product, Category).join(
                Order, order.order_id == OrderProduct.order_id
            ).join(
                Product, Product.product_id == OrderProduct.product_id
            ).join(
                Category, Category.category_id == Product.category_id
            ).filter(
                Order.user_id == user["id"]
            ).all()
            
            if order_history:
             
                products = []
                for order_product, order, product, category in order_history:
                    products.append({
                        "product": product.name,
                        "quantity": order_product.quantity,
                        "category": category.name,
                        "brand": product.brand,
                        "price":product.price
                    })
                    
            history_orders.append({
                "order":order.order_id,
                "shipments":order.shipments,
                "date": order.order_date,
                "total":order.total,
                "products":products
            })
        return {"response": history_orders}
    
    except Exception as ex:
      
        print(ex)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred.")