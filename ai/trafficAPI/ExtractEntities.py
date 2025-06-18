import os
import json
import textwrap
from dotenv import load_dotenv
from google import genai

from APICategory import APICategory
from traffic_intent import TrafficIntent, FindingWayEntity, RealtimeArrivalEntity, RealtimeSubwayEntity
from environmental_intent import EnvironmentalIntent, EnvironmentalEntity

load_dotenv()

# ✅ API 키 설정
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

class ExtractEntities:
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)

        # ✅ 카테고리별 Intent 모델 매핑
        self.category_map = {
            "교통": TrafficIntent,
            "환경": EnvironmentalIntent,
        }

        # ✅ 교통 인텐트별 엔티티 매핑
        self.traffic_intent_map = {
            "길찾기": FindingWayEntity,
            "실시간 도착 정보": RealtimeArrivalEntity,
            "실시간 지하철 도착 정보": RealtimeSubwayEntity,  # ✅ 추가됨
        }

        # ✅ 환경 인텐트별 엔티티 매핑
        self.enviroment_intent_map = {
            "환경 정보 요청": EnvironmentalEntity,
        }

        self.category_to_intent_map = {
            "교통": self.traffic_intent_map,
            "환경": self.enviroment_intent_map,
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

    def extract_category(self, question: str) -> list:
        prompt = textwrap.dedent(f"""
        다음 문장을 보고, 질문이 '교통' 관련인지 '환경' 관련인지 JSON으로 알려주세요.

        문장: "{question}"
        """)
        response = self.call_gemini_api(prompt=prompt, response_schema=list[APICategory])
        return response

    def extract_intents(self, question: str, categories: list) -> list:
        intent_list = []
        for category in categories:
            category = category["category"]
            if category not in self.category_map:
                raise ValueError(f"지원하지 않는 카테고리: {category}")
            
            prompt = textwrap.dedent(f"""
            다음 문장에서 사용자의 의도를 추론해 주세요.

            문장: {question}
            """)
            response = self.call_gemini_api(prompt=prompt, response_schema=list[self.category_map[category]])
            intent_list.append(response)

        return intent_list

    def extract_entities(self, question: str, categories: list, intents_list: list) -> dict:
        result_list = []
        for category, intents in zip(categories, intents_list):
            category = category["category"]
            intent_map = self.category_to_intent_map[category]

            for intent in intents:
                intent_name = intent["intent"]
                if intent_name not in intent_map:
                    raise ValueError(f"지원하지 않는 의도: {intent_name}")
                
                prompt = textwrap.dedent(f"""
                다음 문장에서 사용자의 엔티티를 추론해 주세요.

                문장: {question}
                """)
                response = self.call_gemini_api(prompt=prompt, response_schema=list[intent_map[intent_name]])
                result_list.append({
                    "category": category,
                    "intent": intent_name,
                    "entities": response
                })

        return {
            "question": question,
            "results": result_list
        }


# ✅ 실행 예시
if __name__ == "__main__":
    extractor = ExtractEntities(api_key=os.getenv("GOOGLE_API_KEY"))

    # 🚍 예시 1 - 버스
    question1 = "서울역에서 홍대입구까지 가는 길을 알려줘"
    cats1 = extractor.extract_category(question1)
    intents1 = extractor.extract_intents(question1, cats1)
    result1 = extractor.extract_entities(question1, cats1, intents1)
    print(f"🚌 추출된 엔티티:\n{json.dumps(result1, ensure_ascii=False, indent=2)}\n")

    # 🚇 예시 2 - 지하철
    question2 = "오늘 서울역에서 강남역 방향으로 가는 열차 도착시간 알려줘"
    cats2 = extractor.extract_category(question2)
    intents2 = extractor.extract_intents(question2, cats2)
    result2 = extractor.extract_entities(question2, cats2, intents2)
    print(f"🚇 추출된 엔티티:\n{json.dumps(result2, ensure_ascii=False, indent=2)}")
