import os
import openai
from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth import decode_token
from schemas import (
    ConversationRequest,
    ComicRequest,
    ComicOut,
    CharacterRequest,
    CharacterOut,
)
from db import comics_collection, characters_collection

openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter(prefix="/ai", tags=["ai"])
security = HTTPBearer()

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    token = creds.credentials
    return decode_token(token)

@router.post("/conversation")
async def conversation(data: ConversationRequest, user: dict = Depends(get_current_user)):
    if not openai.api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    prompt = (
        f"These are 2 reviews from 2 different people about {data.merchant}. "
        "Mix both reviews and convert this into a cute conversation with proper start and ending. Make the content more fun."
        + "\n".join(data.reviews)
    )
    resp = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
    )
    text = resp.choices[0].message.content.strip()
    print("Conversation:", text)
    return {"conversation": text}

@router.post("/character", response_model=CharacterOut)
async def create_character(data: CharacterRequest, user: dict = Depends(get_current_user)):
    if not openai.api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    count = await characters_collection.count_documents({"user_id": user.get("sub")})
    if count >= 3:
        raise HTTPException(status_code=400, detail="Character limit reached")

    prompt = (
        f"Create a high-quality, transparent 3D cartoon character named {data.name}. "
        f"{data.description}. Make it consistent for future comics."
    )
    image = openai.images.generate(
        model="gpt-image-1",
        prompt=prompt,
        n=1,
        size="1024x1024",
        quality="high",
    )
    result = image.data[0]
    img_data = result.b64_json if hasattr(result, "b64_json") else result.url
    doc = {
        "user_id": user.get("sub"),
        "name": data.name,
        "description": data.description,
        "image": img_data,
        "created_at": datetime.utcnow(),
    }
    res = await characters_collection.insert_one(doc)
    return {
        "id": str(res.inserted_id),
        "name": data.name,
        "image": img_data,
        "description": data.description,
    }

@router.get("/characters", response_model=list[CharacterOut])
async def get_characters(user: dict = Depends(get_current_user)):
    cursor = characters_collection.find({"user_id": user.get("sub")}).sort("created_at", -1)
    chars = []
    async for doc in cursor:
        chars.append(
            {
                "id": str(doc.get("_id")),
                "name": doc.get("name"),
                "image": doc.get("image"),
                "description": doc.get("description"),
            }
        )
    return chars

@router.post("/comic")
async def comic(data: ComicRequest, user: dict = Depends(get_current_user)):
    if not openai.api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    if data.characters and len(data.characters) > 3:
        raise HTTPException(status_code=400, detail="A maximum of 3 characters can be used.")

    chars = []
    if data.characters:
        ids = [ObjectId(cid) for cid in data.characters]
        cursor = characters_collection.find({"_id": {"$in": ids}, "user_id": user.get("sub")})
        async for doc in cursor:
            chars.append(doc)
        if len(chars) != len(ids):
            raise HTTPException(status_code=400, detail="Invalid characters selected")

    char_names = ", ".join([c.get("name") for c in chars]) if chars else ""
    char_desc = "; ".join([f"{c.get('name')}: {c.get('description', '')}" for c in chars]) if chars else ""
    char_prompt = ""
    if chars:
        char_prompt = (
            f"Include the following characters: {char_names}. "
            f"Character details: {char_desc}. "
        )

    prompt = (
        f"Create a high-quality, 3D cartoon comic strip for the merchant {data.merchant}. "
        f"Make it visually engaging with appropriate backgrounds and foregrounds. "
        f"Focus on expressive characters, natural poses"
        f"Keep text minimal (speech bubbles only) and legible. "
        f"Create a complete image without stripping any side and maintaining consistency in characters. "
        f"Ensure the merchant name '{data.merchant}' appears clearly in the comic. "
        f"{char_prompt}"
        f"Conversation: {data.conversation}"
    )

    image = openai.images.generate(
        model="gpt-image-1",
        prompt=prompt,
        n=1,
        size="1024x1536",
        quality="high",
    )

    result = image.data[0]
    img_data = result.b64_json if hasattr(result, "b64_json") else result.url

    await comics_collection.insert_one(
        {
            "user_id": user.get("sub"),
            "image": img_data,
            "prompt": prompt,
            "merchant": data.merchant,
            "created_at": datetime.utcnow(),
            "characters": data.characters,
        }
    )

    if hasattr(result, "b64_json"):
        return {"image": result.b64_json, "prompt": prompt}
    else:
        return {"image_url": result.url, "prompt": prompt}

@router.get("/comics", response_model=list[ComicOut])
async def get_comics(user: dict = Depends(get_current_user)):
    cursor = comics_collection.find({"user_id": user.get("sub")}).sort("created_at", -1)
    comics = []
    async for doc in cursor:
        comics.append(
            {
                "id": str(doc.get("_id")),
                "image": doc.get("image"),
                "prompt": doc.get("prompt", ""),
            }
        )
    return comics
