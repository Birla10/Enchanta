from pydantic import BaseModel
from typing import List, Optional


class Review(BaseModel):
    author_name: str
    rating: float
    text: str


class ConversationRequest(BaseModel):
    reviews: List[str]
    merchant: str


class ComicRequest(BaseModel):
    conversation: str
    merchant: str
    characters: List[str] = []


class ComicOut(BaseModel):
    id: str
    image: str
    prompt: str


class CharacterRequest(BaseModel):
    name: str
    description: str


class CharacterOut(BaseModel):
    id: str
    name: str
    image: str
    description: Optional[str] = None
