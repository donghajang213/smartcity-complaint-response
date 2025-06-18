from fastapi import APIRouter
from pydantic import BaseModel
from services import intent_api_handler

router = APIRouter()

class ChatIn(BaseModel):
	message: str

@router.post("/chat")
async def chat(req: ChatIn):
    # Intent API 핸들러를 사용하여 질문 처리
    # results = await intent_api_handler(req.message)
    results = intent_api_handler(req.message)
    print(results)

    return results