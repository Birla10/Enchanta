import os
import openai
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..auth import decode_token
from ..schemas import ConversationRequest, ComicRequest

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
        "Given the following customer reviews, create a short conversation that would be suitable for a comic strip:"
        + "\n".join(data.reviews)
    )
    resp = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=150,
    )
    text = resp.choices[0].message.content.strip()
    return {"conversation": text}


@router.post("/comic")
async def comic(data: ComicRequest, user: dict = Depends(get_current_user)):
    if not openai.api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    prompt = f"Create a 3d comic strip with the following conversation: {data.conversation}"
    image = openai.Image.create(
        prompt=prompt,
        n=1,
        size="1024x1024",
        response_format="b64_json",
    )
    return {"image": image.data[0].b64_json, "prompt": prompt}
