import os
import openai
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth import decode_token
from schemas import ConversationRequest, ComicRequest

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
        "These are 2 reviews from 2 different people. Mix both reviews and convert this into a cute conversation between 2 people talking. Make the content more fun."
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


@router.post("/comic")
async def comic(data: ComicRequest, user: dict = Depends(get_current_user)):
    if not openai.api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    prompt = (
        f"Create a high-quality, 3D comic strip of this conversation. "
        f"Make it visually engaging, colorful, and marketing-friendly. "
        f"Focus on expressive characters, natural poses, and cozy cafe backgrounds. "
        f"Keep text minimal (speech bubbles only) and legible. "
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

    if hasattr(result, "b64_json"):  # only in older API format
        return {"image": result.b64_json, "prompt": prompt}
    else:
        return {"image_url": result.url, "prompt": prompt}
