from IntentEntity import ExtractEntities
from trafficAPI import process_question
from weather_call2 import call_weather_api_from_entities

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

def main(question: str):
    entities = extract_entities(question)

    for result in entities["results"]:
        if result["category"] == "교통":
            arv_info = process_question(result)
        elif result["category"] == "날씨" or result["category"] == "환경":
            call_weather_api_from_entities(result)


if __name__ == "__main__":
    question = "한남운수대학동차고지에서 501번 버스 언제 와?"
    print("\n\n\n교통 관련 ")
    main(question)

    # 날씨 정보 예시
    print("\n\n\n날씨 관련 ")
    question2 = "오늘 합정 12시 온도랑 미세먼지 알려줘"
    main(question2)