from .IntentEntity import ExtractEntities
from .trafficAPI.bus_arrival_query2 import process_question1
from .weather_call import call_weather_api_from_entities
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv
import os


load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def extract_entities(question: str):
    extractor = ExtractEntities(api_key=GOOGLE_API_KEY)
    cts = extractor.extract_category(question)
    intents = extractor.extract_intents(question, cts)
    entities = extractor.extract_entities(question, cts, intents)
    return entities

def intent_api_handler2(message: str):
    print(f"Received user message: {message}")
    
    extractor = ExtractEntities(api_key=GOOGLE_API_KEY)
    categories = extractor.extract_category(message)
    intents = extractor.extract_intents(message, categories)
    extracted = extractor.extract_entities(message, categories, intents)

    print("👉 의도/엔티티 추출 결과:", extracted)

    results = []
    with ThreadPoolExecutor() as executor:
        futures = []
        for ent_result in extracted.get("results", []):
            category = ent_result["category"]
            intent = ent_result["intent"]

            if category == "날씨" or category == "환경":
                print("🌦 날씨/환경 처리 시작")
                future = executor.submit(call_weather_api_from_entities, ent_result)
                futures.append(future)
            elif category == "교통":
                future = executor.submit(process_question1, ent_result)
                futures.append(future)
            
        for future in as_completed(futures):
            try:
                results.append(future.result())
            except Exception as e:
                print("Error:", e)
                results.append({"error": str(e)})

    return {"question": message, "results": results}




# if __name__ == "__main__":
    # question = "한남운수대학동차고지에서 501번 버스 언제 와?"
    # print("\n\n\n교통 관련 ")
    # intent_api_handler(question)

    # # 날씨 정보 예시
    # print("\n\n\n날씨 관련 ")
    # question2 = "오늘 합정 12시 온도랑 미세먼지 알려줘"
    # intent_api_handler(question2)

    # 통합 질문
    # print("\n\n\n통합 질문 관련 ")
    # question3 = "합정 날씨랑 홍대입구역 방면 합정역 지하철 도착 정보 알려줘"
    # intent_api_handler(question3)

    # print("\n\n\n통합 질문 관련 ")
    # question3 = "합정 미세먼지랑 홍대입구역 방면 합정역 지하철 도착 정보 알려줘"
    # results = intent_api_handler(question3)
=======
from .IntentEntity import ExtractEntities
from .trafficAPI.bus_arrival_query2 import process_question1
from .weather_call import call_weather_api_from_entities
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv
import os


load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def extract_entities(question: str):
    extractor = ExtractEntities(api_key=GOOGLE_API_KEY)
    cts = extractor.extract_category(question)
    intents = extractor.extract_intents(question, cts)
    entities = extractor.extract_entities(question, cts, intents)
    return entities

def intent_api_handler2(message: str):
    print(f"Received user message: {message}")
    
    extractor = ExtractEntities(api_key=GOOGLE_API_KEY)
    categories = extractor.extract_category(message)
    intents = extractor.extract_intents(message, categories)
    extracted = extractor.extract_entities(message, categories, intents)

    print("👉 의도/엔티티 추출 결과:", extracted)

    results = []
    with ThreadPoolExecutor() as executor:
        futures = []
        for ent_result in extracted.get("results", []):
            category = ent_result["category"]
            intent = ent_result["intent"]

            if category == "날씨" or category == "환경":
                print("🌦 날씨/환경 처리 시작")
                future = executor.submit(call_weather_api_from_entities, ent_result)
                futures.append(future)
            elif category == "교통":
                future = executor.submit(process_question1, ent_result)
                futures.append(future)
            
        for future in as_completed(futures):
            try:
                results.append(future.result())
            except Exception as e:
                print("Error:", e)
                results.append({"error": str(e)})

    return {"question": message, "results": results}




# if __name__ == "__main__":
    # question = "한남운수대학동차고지에서 501번 버스 언제 와?"
    # print("\n\n\n교통 관련 ")
    # intent_api_handler(question)

    # # 날씨 정보 예시
    # print("\n\n\n날씨 관련 ")
    # question2 = "오늘 합정 12시 온도랑 미세먼지 알려줘"
    # intent_api_handler(question2)

    # 통합 질문
    # print("\n\n\n통합 질문 관련 ")
    # question3 = "합정 날씨랑 홍대입구역 방면 합정역 지하철 도착 정보 알려줘"
    # intent_api_handler(question3)

    # print("\n\n\n통합 질문 관련 ")
    # question3 = "합정 미세먼지랑 홍대입구역 방면 합정역 지하철 도착 정보 알려줘"
    # results = intent_api_handler(question3)