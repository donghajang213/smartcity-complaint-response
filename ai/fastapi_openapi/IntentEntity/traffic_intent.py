from pydantic import BaseModel
from typing import Literal

# ✅ 길찾기용 엔티티
class FindingWayEntity(BaseModel):
    type: Literal["출발지", "도착지", "교통수단"]
    value: str

# ✅ 실시간 버스 도착 정보용 엔티티
class RealtimeBusEntity(BaseModel):
    type: Literal["정류장", "노선"]
    value: str

# ✅ 실시간 지하철 도착 정보용 엔티티
class RealtimeSubwayEntity(BaseModel):
    type: Literal["지하철역"]
    value: str

# ✅ Intent 모델 통합
class TrafficIntent(BaseModel):
    intent: Literal["길찾기", "실시간 도착 정보", "실시간 지하철 도착 정보"]
