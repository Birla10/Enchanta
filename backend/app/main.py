from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .db import users_collection
from .auth import double_hash, verify_password, create_token, decode_token
from .models.user import UserIn
from .routers import reviews, comic

app = FastAPI()
app.include_router(reviews.router)
app.include_router(comic.router)

security = HTTPBearer()


@app.post('/register')
async def register(user: UserIn):
    existing = await users_collection.find_one({'email': user.email})
    if existing:
        raise HTTPException(status_code=400, detail='Email already registered')
    hashed = double_hash(user.password)
    await users_collection.insert_one({'email': user.email, 'hashed_password': hashed})
    return {'message': 'User registered'}


@app.post('/login')
async def login(user: UserIn):
    db_user = await users_collection.find_one({'email': user.email})
    if not db_user or not verify_password(user.password, db_user['hashed_password']):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    token = create_token({'sub': str(db_user['_id']), 'email': user.email})
    return {'access_token': token}


@app.get('/me')
async def me(creds: HTTPAuthorizationCredentials = Depends(security)):
    token = creds.credentials
    user = decode_token(token)
    return {'user': user}
