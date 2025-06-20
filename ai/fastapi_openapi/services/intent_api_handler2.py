from .IntentEntity import ExtractEntities
from .trafficAPI.bus_arrival_query2 import process_question1
from .weather_call import call_weather_api_from_entities

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

def intent_api_handler2(question: str):
    entities = extract_entities(question)
    results_dict = {
        "question" : question,
        "results" : []
    }
    api_results = []
    for ent_result in entities["results"]:
        api_result = ent_result.copy()
        if ent_result["category"] == "교통":
            traffic_results = process_question1(ent_result)
            api_results.append(traffic_results)
        elif ent_result["category"] == "날씨" or ent_result["category"] == "환경":
            weather_results = call_weather_api_from_entities(ent_result)
            api_results.append(weather_results)

    results_dict["results"] = api_results
    return results_dict



if __name__ == "__main__":
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

    print("\n\n\n통합 질문 관련 ")
    question3 = "합정 미세먼지랑 홍대입구역 방면 합정역 지하철 도착 정보 알려줘"
    results = intent_api_handler(question3)
    print(f"\n\n\n\n\n\n\n\n\n\n\n최종 결과:\n{results}")