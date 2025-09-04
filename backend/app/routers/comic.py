import os
import openai
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth import decode_token
from schemas import ConversationRequest, ComicRequest, ComicOut
from db import comics_collection

openai.api_key = os.getenv('OPENAI_API_KEY')

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
        "These are 2 reviews from 2 different people. Mix both reviews and convert this into a cute conversation with proper start and ending. Make the content more fun."
        + "\n".join(data.reviews)
    )
    resp = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=170,
    )
    text = resp.choices[0].message.content.strip()
    print("Conversation:", text)
    return {"conversation": text}


@router.post("/comic")
async def comic(data: ComicRequest, user: dict = Depends(get_current_user)):
    if not openai.api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    prompt = (
        f"Create a high-quality, 3D cartoon comic strip of this conversation. "
        f"Make it visually engaging with appropriate backgrounds and foregrounds. "
        f"Focus on expressive characters, natural poses"
        f"Keep text minimal (speech bubbles only) and legible. "
        f"Create a complete image without stripping any side "
        f"Conversation: {data.conversation}"
    )

    image = openai.images.generate(
        model="gpt-image-1",   # ✅ latest image model
        prompt=prompt,
        n=1,
        size="1024x1024",
        quality="high"
    )

    # New SDK usually returns a URL
    result = image.data[0]
    img_data = result.b64_json if hasattr(result, "b64_json") else result.url

    await comics_collection.insert_one({
        "user_id": user.get("sub"),
        "image": img_data,
        "prompt": prompt,
        "created_at": datetime.utcnow(),
    })

    if hasattr(result, "b64_json"):  # only in older API format
        return {"image": result.b64_json, "prompt": prompt}
    else:
        return {"image_url": result.url, "prompt": prompt}


@router.get("/comics", response_model=list[ComicOut])
async def get_comics(user: dict = Depends(get_current_user)):
    cursor = comics_collection.find({"user_id": user.get("sub")}).sort("created_at", -1)
    comics = []
    async for doc in cursor:
        comics.append({"id": str(doc.get("_id")), "image": doc.get("image"), "prompt": doc.get("prompt", "")})
    return comics
