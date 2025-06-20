import os
from google import genai
from .APICategory import APICategory
from .traffic_intent import *
from .weather_intent import *
from .environment_intent import *
from dotenv import load_dotenv
import textwrap
import json

load_dotenv()

class ExtractEntities:
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)

        self.category_map = {
            "교통": TrafficIntent,
            "환경": DustIntent,
            "날씨": WeatherIntent
        }
        self.traffic_intent_map = {
            "길찾기": FindingWayEntity,
            "실시간 버스 도착 정보": RealtimeBusEntity,
            "실시간 지하철 도착 정보": RealtimeSubwayEntity
        }
        self.environment_intent_map = {
            "미세먼지": DustEntity
        }
        self.weather_intent_map = {
            "날씨": WeatherEntity
        }
        self.category_to_intent_map = {
            "교통": self.traffic_intent_map,
            "환경": self.environment_intent_map,
            "날씨": self.weather_intent_map
        }
    
    def call_gemini_api(self, prompt: str, response_schema) -> str:
        response = self.client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": response_schema
            }
        )
        
        return json.loads(response.text)

    def extract_category(self, question: str) -> str:
        prompt = textwrap.dedent(f"""
        다음 문장을 보고, 질문이 '교통' 관련인지 '환경' 관련인지 '날씨' 관련인지 JSON으로 알려주세요.

        문장: "{question}"

        """)

        response = self.call_gemini_api(prompt=prompt, response_schema=list[APICategory])
        return response

    def extract_intents(self, question: str, categories: list) -> str:
        intent_list = []
        for category in categories:
            category = category["category"]
            if category not in self.category_map.keys():
                raise ValueError(f"지원하지 않는 카테고리: {category}. 지원되는 카테고리: {self.category_map.keys()}")
        
            # 가능한 intent 리스트 추출
            valid_intents = set(self.category_to_intent_map[category].keys())
            
            prompt = textwrap.dedent(f"""
            다음 문장에서 '{category}' 카테고리에 해당하는 사용자의 의도를 추론해 주세요.
            가능한 의도: {', '.join(valid_intents)}
            문장: {question}
            """)

            response = self.call_gemini_api(prompt=prompt, response_schema=list[self.category_map[category]])
            
            # 유효한 의도만 필터링 후 중복 제거
            seen = set()
            filtered = []
            for item in response:
                intent_value = item["intent"]
                if intent_value in valid_intents and intent_value not in seen:
                    seen.add(intent_value)
                    filtered.append(item)

            print(f"{category} 의도 추출 결과: {filtered}")
            intent_list.append(filtered)

        return intent_list
    
    

    def extract_entities(self, question: str, categories: list, intents_list: list) -> list:
        result_list = []
        for category, intents in zip(categories, intents_list):
            category = category["category"]
            print(f"category: {category}")
            intent_map = self.category_to_intent_map[category]
            print(f"intent_map keys: {list(intent_map.keys())}")
            for intent in intents:
                intent = intent["intent"]
                print(f"intent: {intent}")
                if intent not in intent_map.keys():
                    raise ValueError(f"지원하지 않는 의도: {intent}. 지원되는 의도: {intent_map.keys()}")
                prompt = textwrap.dedent(f"""
                다음 문장에서 사용자의 엔티티를 추론해 주세요.

                문장: {question}

                """)
                response = self.call_gemini_api(prompt=prompt, response_schema=list[intent_map[intent]])
                result = {
                    "category": category,
                    "intent": intent,
                    "entities": response
                }
                result_list.append(result)

        question_result = {
            "question": question,
            "results": result_list
        }
        return question_result
    

if __name__ == "__main__":
    extract_entities = ExtractEntities(api_key=os.getenv("GOOGLE_API_KEY"))
    question = "서울역에서 홍대입구까지 가는 길을 알려줘"
    
    categories = extract_entities.extract_category(question)
    intents = extract_entities.extract_intents(question, categories)
    entities = extract_entities.extract_entities(question, categories, intents)
    print(f"추출된 엔티티: {entities}")

    # q2 = "오늘 서울역에서 강남역 방향으로 가는 열차 도착시간 알려줘"
    # categories = extract_entities.extract_category(q2)
    # intents = extract_entities.extract_intents(q2, categories)
    # entities = extract_entities.extract_entities(q2, categories, intents)
    # print(f"추출된 엔티티: {entities}")

    q3 = "종로구 몇도인지랑 비와?"
    categories = extract_entities.extract_category(q3)
    intents = extract_entities.extract_intents(q3, categories)
    entities = extract_entities.extract_entities(q3, categories, intents)
    print(f"🔍 추출된 엔티티: {entities}") 