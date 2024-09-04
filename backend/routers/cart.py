from pydantic import BaseModel, Field
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import get_db
from models import *
from fastapi import Request, Depends


router = APIRouter(
    prefix='/cart',
    tags=['cart-handle']
)


db_dependency = Annotated[Session, Depends(get_db)]


class CartItem(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0)


@router.post("/add-device/", status_code=status.HTTP_200_OK)
async def add_device_cart(db: db_dependency, request: Request, cart_item: CartItem):
    
        # Get product from database
        product = db.query(Product).filter(Product.product_id == cart_item.product_id).first()
        
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sorry, there is not a product identified with that id")

        if product.stock < cart_item.quantity or not product.is_stock:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough stock available")
        
        # Retrieve cart from session
        cart = request.session.get("cart")
        
        # Ensure cart is a dictionary
        if not isinstance(cart, dict):
            cart = {}

        cart[cart_item.product_id] = cart_item.quantity
      
        request.session['cart'] = cart

        return {"response": "devices added successfuly!"}
    


@router.get("/", status_code=status.HTTP_200_OK)
async def get_cart_items(request: Request, db: db_dependency):
    
    # Retrieve cart from session
    cart = request.session.get("cart")

    try:
        
        if not isinstance(cart, dict):
            cart = {}
        devices_cart = []
        for id, quantity in cart.items():
            product = db.query(Product, Image).join(Image).filter(Product.product_id == int(id)).first()
            devices_cart.append(
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
        
        sum_prices = sum([item["total"] for item in devices_cart])
        total_quantity = sum([item["quantity"] for item in devices_cart])
        return {"cart": devices_cart, "total_price": sum_prices, "total_quantity": total_quantity}
    except Exception as ex:
        print(ex)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred.")

@router.put("/update-cart-quantity/", status_code=status.HTTP_200_OK)
async def update_cart_quantity(request: Request, product_id: int, action: str, db:db_dependency):
    cart = request.session.get("cart")
    
    if not isinstance(cart, dict):
        cart = {}
    
    try:
        product_stock = db.query(Product).filter(Product.product_id == product_id).first().stock
        product_id = str(product_id)

        # Ensure cart exists and is a dictionary
        if cart and isinstance(cart, dict):
            # Check if the item exists in the cart
            if product_id in cart:
                # Get the current quantity
                current_quantity = cart[product_id]
            
                # Update the quantity based on the action
                if action == "plus":
                    if current_quantity < product_stock:
                        cart[product_id] = current_quantity + 1
                    else:
                        # make sure quantity does not excedes current stock!
                        cart[product_id] = product_stock
                    
                elif action == "minus":
                    if current_quantity > 1:
                        cart[product_id] = current_quantity - 1
                    else:
                        return {"response": "Quantity cannot be less than 1!"}
                else:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid action")

                # Save the updated cart back to the session
                request.session['cart'] = cart

                return {"response": "Cart quantity updated successfully!", "new_quantity": cart[product_id]}
            else:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found in cart")
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty or invalid")
    except Exception as ex:
      
        print(ex)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred.")


@router.delete("/delete-device/", status_code=status.HTTP_200_OK)
async def delete_device_cart(request:Request, product_id: int):
    
    cart = request.session.get("cart")

    if not isinstance(cart, dict):
        cart = {}
    
    product_id = str(product_id)

    # Ensure cart exists and is a dictionary
    if cart and isinstance(cart, dict):
        # Check if the item exists in the cart
        if product_id in cart:
            # Remove the item from the cart
            del cart[product_id]
            
            # Save the updated cart back to the session
            request.session['cart'] = cart

            return {"response": "Device deleted successfully!"}
        else:
            return {"response": "Device not found in cart!"}
    else:
        return {"response": "Cart is empty or invalid!"}
    
