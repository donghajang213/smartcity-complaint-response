import os
import json
import requests
import xmltodict
from ..IntentEntity import ExtractEntities
from dotenv import load_dotenv
import time
from typing import Optional

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 🚏 arsID JSON 로드
with open(os.path.join(BASE_DIR, "../../data", "arsid.json"), "r", encoding="utf-8") as f:
    station_data = json.load(f)

# ✅ 통합 지하철 JSON 로드
with open(os.path.join(BASE_DIR, "../../data", "subway_station_list.json"), "r", encoding="utf-8") as f:
    subway_data = json.load(f)

# ✅ 지하철역 이름 정규화 함수
def normalize_subway_name(name: str) -> str:
    for row in subway_data:
        station_name = row.get("station_name")
        if not station_name:
            continue
        if name in station_name or station_name in name:
            return station_name
    return name.replace("역", "")

def get_ars_id_by_station_name(name: str) -> str:
    for station in station_data:
        if station["stationName"] == name:
            return station["arsID"]
    return None

def get_bus_arrival_info(ars_id: str, target_bus_no: str = None):
    SERVICE_KEY = os.getenv("SEOUL_BUS_API_KEY")
    url = "http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid"
    params = {
        "ServiceKey": SERVICE_KEY,
        "arsId": ars_id.strip()
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        return []

    parsed = xmltodict.parse(response.text)
    json_data = json.loads(json.dumps(parsed))
    msg_body = json_data.get("ServiceResult", {}).get("msgBody")

    if not msg_body:
        return []

    item_list = msg_body.get("itemList")
    if not item_list:
        return []

    result = []
    if isinstance(item_list, dict):
        item_list = [item_list]

    for item in item_list:
        rtNm = item.get("rtNm")
        arrmsg1 = item.get("arrmsg1")
        if not target_bus_no or target_bus_no == rtNm:
            result.append({"busNo": rtNm, "arrivalMessage": arrmsg1})

    return result

def get_subway_arrival_info(station_name: str):
    SEOUL_SUBWAY_API_KEY = os.getenv("SEOUL_SUBWAY_API_KEY")
    url = f"http://swopenAPI.seoul.go.kr/api/subway/{SEOUL_SUBWAY_API_KEY}/json/realtimeStationArrival/1/1000/{station_name}"

    response = requests.get(url)
    if response.status_code != 200:
        return []

    try:
        data = response.json()
        if "realtimeArrivalList" not in data:
            return []

        arrivals = data["realtimeArrivalList"]
        result_data = []
        for row in arrivals[:5]:
            result_data.append({
                "trainLineNm": row.get("trainLineNm", ""),
                "arvlMsg2": row.get("arvlMsg2", "")
            })
        return result_data

    except Exception:
        return []

# 🚀 질문 1건 처리 함수
def process_question1(entities_result: dict):
    results_dict = {
        "entity_results": entities_result,
        "API_results": []
    }
    api_results = []

    realtime_entities = None
    realtime_subway_entities = None

    if entities_result["intent"] == "실시간 버스 도착 정보":
        realtime_entities = entities_result["entities"]
    elif entities_result["intent"] == "실시간 지하철 도착 정보":
        realtime_subway_entities = entities_result["entities"]

    # 🚍 버스 도착 처리
    if realtime_entities and not realtime_subway_entities:
        station_name = None
        bus_no = None
        for entity in realtime_entities:
            if entity["type"] == "정류장":
                station_name = entity["value"]
            elif entity["type"] == "노선":
                bus_no = entity["value"].replace("번", "").strip()

        ars_id = get_ars_id_by_station_name(station_name)
        if ars_id:
            arrival_info = get_bus_arrival_info(ars_id, target_bus_no=bus_no)
            if arrival_info:
                api_results.append({
                    "type": "버스",
                    "data": arrival_info
                })

    # 🚇 지하철 도착 처리
    if realtime_subway_entities:
        subway_station_name = None

        for entity in realtime_subway_entities:
            if entity["type"] == "지하철역":
                subway_station_name = entity["value"]
                break

        if subway_station_name:
            normalized_name = normalize_subway_name(subway_station_name)
            arrival_info = get_subway_arrival_info(normalized_name)
            if arrival_info:
                api_results.append({
                    "type": "지하철",
                    "data": arrival_info
                })

    results_dict["API_results"] = api_results
    return results_dict