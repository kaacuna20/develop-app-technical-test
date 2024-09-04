from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Annotated
from datetime import datetime, timedelta
from uuid import UUID, uuid4
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import get_db
from models import User
from sqlalchemy.exc import IntegrityError

router = APIRouter(
    prefix='/auth',
    tags=['authentication']
)

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
auth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str
    username: str
       
class Token(BaseModel):
    access_token: str
    token_type: str
    
        
db_dependency = Annotated[Session, Depends(get_db)]

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: CreateUserRequest):
    # verify if email exist
    existing_user_by_email = db.query(User).filter(User.email == create_user_request.email).first()
    if existing_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered."
        )
    
    # verify if username exist
    existing_user_by_username = db.query(User).filter(User.username == create_user_request.username).first()
    if existing_user_by_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username is already taken."
        )
    
    create_user_model = User(
        user_id=uuid4(),
        email=create_user_request.email,
        username=create_user_request.username,
        password=bcrypt_context.hash(create_user_request.password)
    )
    
    try:
        db.add(create_user_model)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user due to a database error."
        )
    return {"new_user": f"user {create_user_request.username} was created successfully!"}

@router.post("/token/", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Could not validate user.')
    token = create_access_token(user.username, user.user_id, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    
    return {'access_token': token, 'token_type': 'bearer'}
    
def authenticate_user(username: str, password: str, db):
    user = db.query(User).filter(User.username == username, User.is_active==True).first()
    if not user:
        return False
    
    if not bcrypt_context.verify(password, user.password):
        return False
    return user

def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {'sub': username, 'id': user_id}
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: Annotated[str, Depends(auth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Could not validate user.',
                                headers={"WWW-Authenticate": "Bearer"},)
        return {'username': username, 'id': user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user.')
    
async def admin_access(user: Annotated[dict, Depends(get_current_user)], db:db_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    
    user = db.query(User).filter(User.user_id == user["id"]).first()
    
    # verify if user is admin after authentication
    if not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Your are not authorizated, you are not admin!")
    return {"UserAmin": user}

@router.get("/protected-route/", status_code=status.HTTP_200_OK)
async def user(user: Annotated[dict, Depends(get_current_user)], db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    return {"user": user}