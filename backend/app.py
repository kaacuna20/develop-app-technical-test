from fastapi import FastAPI
from models import *
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from routers import auth, admin, cart, order, products, user, csfr_token
from fastapi.staticfiles import StaticFiles

app = FastAPI()


app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(cart.router)
app.include_router(order.router)
app.include_router(products.router)
app.include_router(user.router)
app.include_router(csfr_token.router)

app.mount("/images", StaticFiles(directory="images"), name="images")


origins =[
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.add_middleware(
    SessionMiddleware, 
    secret_key="supersecretkey",
    session_cookie="my_cookie",
    max_age=3600  # 1 hour
)

        


