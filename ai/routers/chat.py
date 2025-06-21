from fastapi import APIRouter
from pydantic import BaseModel
from services import smartcity_question_handler

router = APIRouter()

class ChatIn(BaseModel):
	message: str

class ChatOut(BaseModel):
    answer: dict

@router.post("/chat", response_model=ChatOut)
async def chat(req: ChatIn):
    print(f"전달 받은 메시지: {req.message}")
    try:
        result_text = smartcity_question_handler(req.message)
        print(f"최종 결과:\n{result_text}")
        return ChatOut(answer = result_text)
    except Exception as e:
        print("Error in smartcity_question_handler:", e)
        import traceback; traceback.print_exc()
        return ChatOut(answer = {"error": "서버 처리 중 오류가 발생했습니다."})