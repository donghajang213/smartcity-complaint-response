from .IntentEntity import ExtractEntities
from .trafficAPI import process_question
from .weather_call import call_weather_api_from_entities
from langchain_community.chat_models import ChatOpenAI
from .response_gpt import SmartCityRAGResponder, SmartCityAPIResponder

from concurrent.futures import ThreadPoolExecutor, as_completed

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

def smartcity_question_handler(question: str):
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

    if entities["results"][0]["category"] == "일상 대화":
        answer = llm.invoke(question)
        results_dict["results"] = {
            "answer": answer
        }
    with ThreadPoolExecutor() as executor:
        futures = []
        for ent_result in entities["results"]:
            if ent_result["category"] == "교통":
                if ent_result["intent"] != "민원 요청":
                    future = executor.submit(process_question, ent_result)
                    future.ent_result = ent_result
                    futures.append(future)
                elif rag_answer is None:
                    # 민원 요청 있었을 때 RAG 기반 GPT 실행
                    rag_answer = smartcity_rag_gpt.answer(question)

            elif ent_result["category"] == "날씨" or ent_result["category"] == "환경":
                if ent_result["intent"] != "민원 요청":
                    future = executor.submit(call_weather_api_from_entities, ent_result)
                    future.ent_result = ent_result
                    futures.append(future)
                elif rag_answer is None:
                    rag_answer = smartcity_rag_gpt.answer(question)

            elif ent_result["intent"] == "민원 요청" and rag_answer is None:
                rag_answer = smartcity_rag_gpt.answer(question)

        for future in as_completed(futures):
            try:
                result = future.result()
                ent = future.ent_result
                api_results["results"].append({
                    "entity_results": ent,
                    "API_results": result
                })
            except Exception as e:
                print("Error:", e)
                api_results["results"].append({"error": str(e)})

        if rag_answer:
            category_list = []
            for ent_result in entities["results"]:
                category_list.append(ent_result["category"])
                rag_answer["API_results"] = {
                    "category": category_list
                }
                results_dict["results"] = rag_answer

        elif api_results:
            # 민원 요청 없이 OpenAPI 호출만 한 경우
            api_answer = smartcity_api_gpt.answer(api_results)
            results_dict["results"] = api_answer

    return results_dict
