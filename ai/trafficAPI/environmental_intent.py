# environmental_intent.py

from pydantic import BaseModel
from typing import Literal

# 🌱 Entity 타입 제한 (환경 관련)
class EnvironmentalEntity(BaseModel):
    type: Literal["지역", "요청항목"]  # 예: 지역(서울), 요청항목(미세먼지, 초미세먼지, 대기질, 온도 등)
    value: str

# 🌍 Intent 모델 (환경 관련 요청)
class EnvironmentalIntent(BaseModel):
    intent: Literal["환경 정보 요청"]