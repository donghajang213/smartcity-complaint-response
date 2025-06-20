import os
import json
import textwrap
from dotenv import load_dotenv
from google import genai

from APICategory import APICategory
from traffic_intent import TrafficIntent, FindingWayEntity, RealtimeArrivalEntity
from environmental_intent import EnvironmentalIntent, EnvironmentalEntity

load_dotenv()

class ExtractEntities:
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)

        self.category_map = {
            "교통": TrafficIntent,
            "환경": EnvironmentalIntent,
        }

        self.traffic_intent_map = {
            "길찾기": FindingWayEntity,
            "실시간 도착 정보": RealtimeArrivalEntity,
        }

        self.environment_intent_map = {
            "환경 정보 요청": EnvironmentalEntity,
        }

        self.category_to_intent_map = {
            "교통": self.traffic_intent_map,
            "환경": self.environment_intent_map,
        }

    def call_gemini_api(self, prompt: str, response_schema):
        response = self.client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": response_schema
            }
        )
        return json.loads(response.text)

    def extract_category(self, question: str):
        prompt = textwrap.dedent(f"""
        다음 문장을 보고, 질문이 '교통' 관련인지 '환경' 관련인지 JSON으로 알려주세요.

        문장: "{question}"
        """)
        return self.call_gemini_api(prompt=prompt, response_schema=list[APICategory])

    def extract_intents(self, question: str, categories: list):
        intent_list = []
        for category in categories:
            cat = category["category"]
            if cat not in self.category_map:
                raise ValueError(f"지원하지 않는 카테고리: {cat}")
            
            prompt = textwrap.dedent(f"""
            다음 문장에서 사용자의 의도를 추론해 주세요.

            문장: {question}
            """)
            result = self.call_gemini_api(prompt=prompt, response_schema=list[self.category_map[cat]])
            intent_list.append(result)

        return intent_list

    def extract_entities(self, question: str, categories: list, intents_list: list):
        results = []
        for category, intents in zip(categories, intents_list):
            cat = category["category"]
            intent_map = self.category_to_intent_map[cat]

            for intent in intents:
                intent_name = intent["intent"]
                if intent_name not in intent_map:
                    raise ValueError(f"지원하지 않는 의도: {intent_name}")

                prompt = textwrap.dedent(f"""
                다음 문장에서 사용자의 엔티티를 추론해 주세요.

                문장: {question}
                """)
                entity_response = self.call_gemini_api(prompt=prompt, response_schema=list[intent_map[intent_name]])
                results.append({
                    "category": cat,
                    "intent": intent_name,
                    "entities": entity_response
                })

        return {
            "question": question,
            "results": results
        }


if __name__ == "__main__":
    extractor = ExtractEntities(api_key=os.getenv("GOOGLE_API_KEY"))

    test_question = "한남운수대학동차고지에서 501번 버스 언제 와?"

    cats = extractor.extract_category(test_question)
    intents = extractor.extract_intents(test_question, cats)
    entities = extractor.extract_entities(test_question, cats, intents)

    print(json.dumps(entities, ensure_ascii=False, indent=2))