from pydantic import BaseModel
from typing import List


class Review(BaseModel):
    author_name: str
    rating: float
    text: str


class ConversationRequest(BaseModel):
    reviews: List[str]


class ComicRequest(BaseModel):
    conversation: str


class ComicOut(BaseModel):
    id: str
    image: str
    prompt: str
