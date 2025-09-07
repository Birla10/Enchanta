from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from db import users_collection
from auth import double_hash, verify_password, create_token, decode_token
from models.user import UserIn
import routers.reviews as reviews
from routers import reviews, comic
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(comic.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

security = HTTPBearer()

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    token = creds.credentials
    return decode_token(token)

user: dict = Depends(get_current_user)

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

@app.get('/reviews')
async def reviews_endpoint(merchant: str, place: str = '', source: str = 'google', user: dict = Depends(get_current_user)):
    return await reviews.get_reviews(merchant, place, source)

@app.get('/me')
async def me(creds: HTTPAuthorizationCredentials = Depends(security)):
    token = creds.credentials
    user = decode_token(token)
    return {'user': user}
