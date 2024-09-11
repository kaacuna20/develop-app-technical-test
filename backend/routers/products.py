from pydantic import BaseModel
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from starlette import status
from database import get_db
from models import *
from fastapi import Depends
from routers.auth import  get_current_user
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError



router = APIRouter(
    prefix='/store',
    tags=['products']
)

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]  


class UpdateOrderRequest(BaseModel):
    quantity: int
    total: int
    user_id: int
    
    
@router.get("/home/", status_code=status.HTTP_200_OK)
async def offert_products(db: db_dependency):
    try:
        categories = db.query(Category).join(Product).all()
        result = []
        for category in categories:
          # Get products with their corresponding image using join
            products = (
                db.query(Product, Image)
                .join(Image)  
                .filter(Product.category_id == category.category_id)
                .order_by(Product.product_id.desc())
                .limit(5)
                .all()
            )
            result.append({
                "category": category.name,
                "products": [
                    {
                        "name": product.name,
                        "brand": product.brand,
                        "price": product.price,
                        "description": product.description,
                        "images_url": images if images else None,  
                        "slug": product.slug,
                    } for product, images in products
                ]
            })
        return {"response": result}

    except Exception as ex:
        print(ex)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred.")

@router.get("/get-product/{slug}/", status_code=status.HTTP_200_OK)
async def get_produt(db: db_dependency, slug: str):
 
    try:
        product = db.query(Product, Image).join(Image).filter(Product.slug == slug).first()
        
        result = {"product": product[0], "images": product[1]}
        
        if product:
            return {"response": result}
        
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sorry, there is not a product identified with that slug")
    except Exception as ex:
        print(ex)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred.")

@router.get("/categories/", status_code=status.HTTP_200_OK)
async def get_categories(db: db_dependency):
    try:
        categories = db.query(Category).all()
        return {"categories": categories}
    except Exception as ex:
        print(ex)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred.")
    
@router.get("/products/", status_code=status.HTTP_200_OK)
async def get_products(db: db_dependency):
    
    result = []

    try:
        for product, category in db.query(Product, Category).outerjoin(Category).order_by(Product.product_id.desc()).all():
            result.append({
                "name": product.name,
                "ram_memory": product.ram_memory,
                "disk_memory": product.disk_memory,
                "stock": product.stock,
                "slug": product.slug,
                "product_id": product.product_id,
                "brand": product.brand,
                "price": product.price,
                "iva": product.iva,
                "description": product.description,
                "cpu_speed": product.cpu_speed,
                "is_stock": product.is_stock,
                "category_id": category.name if category else None
            })
    
        return {"products": result}
    except Exception as ex:

        print(ex)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred.")

@router.get("/filter-category/{category_id}/", status_code=status.HTTP_200_OK)
async def filter_by_category(
    db: db_dependency,
    category_id: int,
    page: int = Query(1, ge=1),  # Home page, default 1, minimum value 1
    size: int = Query(10, ge=1, le=100)  # Page size, default 10, minimum value 1, maximum value 100
):
    
    try:
        all_products = db.query(Product).filter(Product.category_id == category_id).all()
        if not all_products:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sorry, no products are associated with that category!")
        
        offset = (page - 1) * size
        offset_products = db.query(Product, Image).join(Image).filter(Product.category_id == category_id).order_by(Product.product_id.desc()).offset(offset).limit(size).all()
    
        result = []
        for product, image in offset_products:
            result.append({
                "name": product.name,
                "brand": product.brand,
                "price": product.price,
                "description": product.description,
                "slug": product.slug,
                "images_url":image if image else None,
            })

        if offset_products:
            return {"response": result, "total": len(all_products), "category": all_products[0].category.name}
        
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sorry, there are more products to show!")
    
    except Exception as ex:
       
        print(ex)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred.")

@router.get("/search/", status_code=status.HTTP_200_OK)
async def search(db: db_dependency, search_query: str):
    
    
    
    try:
        search_terms = search_query.split(" ")
        query = db.query(Product, Image).join(Category).join(Image)
        
        for term in search_terms:
            query = query.filter(
                or_(
                    Product.name.ilike(f"%{term}%"),
                    Category.name.ilike(f"%{term}%"),
                    Product.brand.ilike(f"%{term}%")
                )
            )
        
        query = query.distinct()
        results_query = query.all()
        results = []
        
        for product, image in results_query:
            results.append({
                "name": product.name,
                "brand": product.brand,
                "price": product.price,
                "description": product.description,
                "slug": product.slug,
                "images_url":image if image else None,
            })

        return {"response": results} if results else {"response": []}

    except Exception as ex:
        print(ex)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred.")