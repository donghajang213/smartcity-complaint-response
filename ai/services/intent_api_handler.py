from .IntentEntity import ExtractEntities
from .trafficAPI import process_question
from .weather_call2 import call_weather_api_from_entities
from langchain_community.chat_models import ChatOpenAI
from .response_gpt import SmartCityRAGResponder, SmartCityAPIResponder

from dotenv import load_dotenv
import os

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

llm = ChatOpenAI(model="gpt-4o-mini-2024-07-18")
smartcity_rag_gpt = SmartCityRAGResponder(llm)
smartcity_api_gpt = SmartCityAPIResponder(llm)

def extract_entities(question: str):
    extractor = ExtractEntities(api_key=GOOGLE_API_KEY)
    cts = extractor.extract_category(question)
    intents = extractor.extract_intents(question, cts)
    entities = extractor.extract_entities(question, cts, intents)
    return entities

def intent_api_handler(question: str):
    entities = extract_entities(question)
    results_dict = {
        "question" : question,
        "results" : None
    }
    api_results = {
        "question" : question,
        "results" : []
    }
    rag_answer = None
    for ent_result in entities["results"]:
        ent_api_dict = {
            "entity_results" : ent_result,
            "API_results" : dict()
        }
        if ent_result["category"] == "교통":
            if ent_result["intent"] != "민원 요청":
                traffic_results = process_question(ent_result)
                ent_api_dict["API_results"] = traffic_results
                api_results["results"].append(ent_api_dict)
            elif rag_answer is None:
                rag_answer = smartcity_rag_gpt.answer(question)
                
        elif ent_result["category"] == "날씨" or ent_result["category"] == "환경":
            if ent_result["intent"] != "민원 요청":
                weather_results = call_weather_api_from_entities(ent_result)
                ent_api_dict["API_results"] = weather_results
                api_results["results"].append(ent_api_dict)
            elif rag_answer is None:
                rag_answer = smartcity_rag_gpt.answer(question)

        elif ent_result["intent"] == "민원 요청" and rag_answer is None:
            rag_answer = smartcity_rag_gpt.answer(question)

    if rag_answer:
        # 공공 API 결과값들 있을 때 GPT에게 답변 요청
        results_dict["results"] = rag_answer
    elif api_results:
        api_answer = smartcity_api_gpt.answer(api_results)
        results_dict["results"] = api_answer

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