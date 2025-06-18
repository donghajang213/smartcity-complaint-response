from pydantic import BaseModel, root_validator
from typing import List, Union, Literal

# Entity 타입 제한
class FindingWayEntity(BaseModel):
    type: Literal["출발지", "도착지", "교통수단"]
    value: str

class RealtimeArrivalEntity(BaseModel):
    type: Literal["정류장", "노선"]
    value: str

# 최종 Response 모델
class TrafficIntent(BaseModel):
    intent: Literal["길찾기", "실시간 도착 정보"]
    