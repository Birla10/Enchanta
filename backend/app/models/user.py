from pydantic import BaseModel, EmailStr
from typing import Optional


class UserIn(BaseModel):
    email: EmailStr
    password: str


class User(BaseModel):
    id: Optional[str]
    email: EmailStr
    hashed_password: str
