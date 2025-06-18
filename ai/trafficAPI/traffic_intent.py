from pydantic import BaseModel
from typing import Literal

class FindingWayEntity(BaseModel):
    type: Literal["출발지", "도착지", "교통수단"]
    value: str

class RealtimeBusEntity(BaseModel):
    type: Literal["정류장", "노선"]
    value: str

class RealtimeSubwayEntity(BaseModel):  # ✅ 새로 추가된 부분
    type: Literal["지하철역", "방면", "호선", "방향"]
    value: str

class TrafficIntent(BaseModel):
    intent: Literal["길찾기",
                    "실시간 도착 정보",
                    "실시간 지하철 도착 정보"]
