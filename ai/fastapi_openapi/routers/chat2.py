from fastapi import APIRouter
from pydantic import BaseModel
from services import intent_api_handler2

router = APIRouter()

class ChatIn(BaseModel):
	message: str
     
class ChatOut(BaseModel):
    answer: dict
    
@router.post("/chat", response_model=ChatOut)
async def chat(req: ChatIn):
    print(f"Received chat request with message: {req.message}")  # 요청 들어온 메시지 로그
    try:
        result_text = intent_api_handler2(req.message)
        print("Intent handler result:", result_text)
        return ChatOut(answer=result_text)
    except Exception as e:
        print("Error in intent_api_handler:", e)
        import traceback; traceback.print_exc()
        return ChatOut(answer={"error": "서버 처리 중 오류가 발생했습니다."})
