import os
import hashlib
import bcrypt
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv('JWT_SECRET', 'secret')
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_MINUTES = 30


def double_hash(password: str) -> bytes:
    sha = hashlib.sha256(password.encode()).hexdigest().encode()
    return bcrypt.hashpw(sha, bcrypt.gensalt())


def verify_password(password: str, hashed: bytes) -> bool:
    sha = hashlib.sha256(password.encode()).hexdigest().encode()
    return bcrypt.checkpw(sha, hashed)


def create_token(data: dict) -> str:
    payload = data.copy()
    payload['exp'] = datetime.utcnow() + timedelta(minutes=JWT_EXP_DELTA_MINUTES)
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
