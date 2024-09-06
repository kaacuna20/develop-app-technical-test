from fastapi import  APIRouter, Request, Response, HTTPException, Header, Depends
from itsdangerous import URLSafeTimedSerializer
from typing import Annotated
from starlette import status

router = APIRouter(
    prefix='/csrf-token',
    tags=['csrf-token']
)


SECRET_KEY = "your-secret-key"
CSRF_TOKEN_EXPIRATION = 3600  # El token CSRF expira en una hora

# Función para generar el token CSRF
def generate_csrf_token():
    s = URLSafeTimedSerializer(SECRET_KEY)
    return s.dumps("csrf-token")

# Función para validar el token CSRF
def validate_csrf_token(request: Request, csrf_token: str = Header(None)):
    csrf_cookie = request.cookies.get("csrf_token")  # Obtener el token CSRF de las cookies
    print(f"CSRF Cookie: {csrf_cookie}")
    print(f"CSRF Token from Header: {csrf_token}")
    if not csrf_cookie:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No CSRF token in cookies")

    s = URLSafeTimedSerializer(SECRET_KEY)
    try:
        s.loads(csrf_token, max_age=CSRF_TOKEN_EXPIRATION)  # Validar el token enviado en el encabezado
        if csrf_token != csrf_cookie:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="CSRF token mismatch")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"CSRF validation error: {e}")

    return True

# Ruta para enviar el token CSRF al frontend
@router.get("/")
def get_csrf_token(response: Response):
    token = generate_csrf_token()
    # Enviar el token CSRF en una cookie (para solicitudes futuras)
    response.set_cookie(key="csrf_token", value=token)
    print("token-generated ", token)
    return {"csrf_token": token}


csrf_dependency = Annotated[bool,Depends(validate_csrf_token)]
