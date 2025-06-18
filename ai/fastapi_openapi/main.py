from fastapi import FastAPI
from pydantic import BaseModel
import requests
import xmltodict
import urllib.parse

from IntentEntity import ExtractEntities
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    answer: str

def get_entities(question: str) -> dict:
    extract_entities = ExtractEntities(api_key=os.getenv("GOOGLE_API_KEY"))
    question = "서울역에서 홍대입구까지 가는 길을 알려줘"
    
    categories = extract_entities.extract_category(question)
    intents = extract_entities.extract_intents(question, categories)
    entities = extract_entities.extract_entities(question, categories, intents)
    return entities

@app.post("/chat", response_model=ChatResponse)
def chat_handler(request: ChatRequest):
    user_message = request.message
    print(f"📨 사용자 메시지: {user_message}")

    # 간단한 intent/entity 처리: '도착' + '역' 포함 시 지하철 API 호출
    if "도착" in user_message and "역" in user_message:
        station = None
        for keyword in ["서울역", "홍대입구", "신촌", "강남"]:
            if keyword in user_message:
                station = keyword
                break

        if station:
            # 역 이름 인코딩 (URL용)
            station_encoded = urllib.parse.quote(station)
            TRAFFIC_API_KEY = os.getenv("TRAFFIC_API_KEY")
            url = f"https://api.odsay.com/v1/api/searchStation?lang=0&stationName={station_encoded}&CID=1000&apiKey={TRAFFIC_API_KEY}"
            # url = f"http://swopenapi.seoul.go.kr/api/subway/{TRAFFIC_API_KEY}/xml/realtimeStationArrival/1/5/{station_encoded}"

            try:
                res = requests.get(url)
                result_station = res.json().get("result", {}).get("station", {})
                print(f"\n\n결과 정류장들 : {result_station}")
                # parsed = xmltodict.parse(res.text)
                # realtime_data = parsed.get("realtimeStationArrival")

                # if not realtime_data:
                #     return ChatResponse(answer="⚠️ 서울시 API 응답이 올바르지 않습니다.")

                # # 에러 코드가 포함되어 있는 경우 처리
                # result = realtime_data.get("RESULT")
                # if result and result.get("code") != "INFO-000":
                #     return ChatResponse(answer=f"❌ [서울시 API 오류] {result.get('message')}")

                # rows = realtime_data.get("row")
                # if not rows:
                #     return ChatResponse(answer=f"❗ {station}에는 현재 실시간 도착 정보가 없습니다.")

                # # 첫 열차 정보만 출력
                # first = rows[0] if isinstance(rows, list) else rows
                # line = first.get("trainLineNm", "")
                # msg = first.get("arvlMsg2", "")
                return ChatResponse(answer=f"✅ {station}에 {line} 열차가 {msg}")
            except Exception as e:
                print("❌ 예외 발생:", e)
                return ChatResponse(answer=f"❌ {station}의 도착 정보를 불러오는 중 오류가 발생했습니다.")
        else:
            return ChatResponse(answer="❓ 어떤 역의 도착 정보를 원하시나요?")

    return ChatResponse(answer="ℹ️ '서울역 도착 시간 알려줘'처럼 질문해 주세요.")
