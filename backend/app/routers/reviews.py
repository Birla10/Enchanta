import os
import requests
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from schemas import Review
from auth import decode_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY', '')

async def get_reviews(merchant: str, place: str):
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="Google API key not configured")

    query = f"{merchant} {place}".strip()

    # 1) searchText → get the resource name ("places/ChIJ...")
    search_url = "https://places.googleapis.com/v1/places:searchText"
    search_headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        # Ask for the resource name so we can call details next
        "X-Goog-FieldMask": "places.name,places.displayName"
    }
    search_payload = {"textQuery": query}

    s = requests.post(search_url, headers=search_headers, json=search_payload, timeout=15)
    if s.status_code != 200:
        try:
            detail = s.json()
        except Exception:
            detail = s.text
        raise HTTPException(status_code=502, detail=f"Places search failed: {detail}")

    s_json = s.json()
    places = s_json.get("places", [])
    if not places:
        raise HTTPException(status_code=404, detail="Merchant not found")

    resource_name = places[0]["name"]  # e.g., "places/ChIJ…"

    # 2) Place details (v1) → fetch reviews
    details_url = f"https://places.googleapis.com/v1/{resource_name}"
    details_headers = {
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        # Explicit leaf fields for reviews
        "X-Goog-FieldMask": "reviews.text,reviews.rating,reviews.authorAttribution"
    }

    d = requests.get(details_url, headers=details_headers, timeout=15)
    if d.status_code != 200:
        try:
            detail = d.json()
        except Exception:
            detail = d.text
        raise HTTPException(status_code=502, detail=f"Place details failed: {detail}")

    d_json = d.json()
    reviews_data = d_json.get("reviews", []) or []

    print(reviews_data)
    # Map to your schema
    out = []
    for r in reviews_data[:20]:
        author = (r.get("authorAttribution") or {}).get("displayName", "")
        text_obj = r.get("originalText") or r.get("text") or {}
        text = text_obj.get("text", "")
        rating = r.get("rating", 0)
        out.append(Review(author_name=author, rating=rating, text=text))

    return out