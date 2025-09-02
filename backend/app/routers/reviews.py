import os
import requests
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..schemas import Review
from ..auth import decode_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(prefix="/reviews", tags=["reviews"])
security = HTTPBearer()

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY', '')


def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    token = creds.credentials
    return decode_token(token)


@router.get("/", response_model=List[Review])
async def get_reviews(merchant: str, place: str, user: dict = Depends(get_current_user)):
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="Google API key not configured")
    query = f"{merchant} {place}"
    search_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {"query": query, "key": GOOGLE_API_KEY}
    search_resp = requests.get(search_url, params=params).json()
    if not search_resp.get("results"):
        raise HTTPException(status_code=404, detail="Merchant not found")
    place_id = search_resp["results"][0]["place_id"]
    details_url = "https://maps.googleapis.com/maps/api/place/details/json"
    details_params = {
        "place_id": place_id,
        "fields": "reviews",
        "key": GOOGLE_API_KEY,
    }
    details_resp = requests.get(details_url, params=details_params).json()
    reviews_data = details_resp.get("result", {}).get("reviews", [])
    reviews = []
    for r in reviews_data[:20]:
        reviews.append(Review(author_name=r.get("author_name", ""), rating=r.get("rating", 0), text=r.get("text", "")))
    return reviews
