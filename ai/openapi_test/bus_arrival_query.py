import os
import json
import requests
import xmltodict
from ExtractEntitiesTest import ExtractEntities
from dotenv import load_dotenv

load_dotenv()

# 🚏 arsID JSON 로드
with open("station_name_arsid_only.json", "r", encoding="utf-8") as f:
    station_data = json.load(f)

def get_ars_id_by_station_name(name: str) -> str:
    for station in station_data:
        if station["stationName"] == name:
            return station["arsID"]
    return None

def get_bus_arrival_info(ars_id: str, target_bus_no: str = None):
    SERVICE_KEY = os.getenv("SEOUL_BUS_API_KEY")  # 또는 하드코딩된 키
    url = "http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid"
    params = {
        "ServiceKey": SERVICE_KEY,
        "arsId": ars_id.strip()
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        return f"❌ API 호출 실패: {response.status_code}"

    parsed = xmltodict.parse(response.text)
    json_data = json.loads(json.dumps(parsed))
    msg_body = json_data.get("ServiceResult", {}).get("msgBody")

    if not msg_body:
        return f"⚠️ arsID {ars_id}: 도착 정보 없음"

    item_list = msg_body.get("itemList")
    if not item_list:
        return f"⚠️ arsID {ars_id}: 도착 정보 없음"

    result = []
    if isinstance(item_list, dict):
        item_list = [item_list]

    for item in item_list:
        rtNm = item.get("rtNm")  # 버스 번호
        arrmsg1 = item.get("arrmsg1")  # 첫 번째 도착 정보
        if not target_bus_no or target_bus_no == rtNm:
            result.append(f"🚌 {rtNm} - {arrmsg1}")
    return "\n".join(result)

# 🚀 사용 예시
if __name__ == "__main__":
    question = "한남운수대학동차고지에서 501번 버스 언제 와?"
    extractor = ExtractEntities(api_key=os.getenv("GOOGLE_API_KEY"))

    categories = extractor.extract_category(question)
    intents = extractor.extract_intents(question, categories)
    entities_result = extractor.extract_entities(question, categories, intents)
    print(json.dumps(entities_result, ensure_ascii=False, indent=2))

    question2 = "노량진역에서 버스 언제 와?"
    extractor = ExtractEntities(api_key=os.getenv("GOOGLE_API_KEY"))

    categories = extractor.extract_category(question2)
    intents = extractor.extract_intents(question2, categories)
    entities_result = extractor.extract_entities(question2, categories, intents)
    print(json.dumps(entities_result, ensure_ascii=False, indent=2))

    # "실시간 도착 정보" intent의 엔티티 가져오기
    realtime_entities = None
    for item in entities_result["results"]:
        if item["intent"] == "실시간 도착 정보":
            realtime_entities = item["entities"]
            break

    station_name = None
    bus_no = None

    if realtime_entities:
        for entity in realtime_entities:
            if entity["type"] == "정류장":
                station_name = entity["value"]
            elif entity["type"] == "노선":
                bus_no = entity["value"].replace("번", "").strip()  # "501번" → "501"

    ars_id = get_ars_id_by_station_name(station_name)
    if ars_id:
        arrival_info = get_bus_arrival_info(ars_id, target_bus_no=bus_no)
        print(arrival_info)
    else:
        print(f"❌ '{station_name}' 에 해당하는 arsID를 찾을 수 없습니다.")
