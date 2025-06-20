from pydantic import BaseModel
from typing import Literal

# Entity 타입 제한
class WeatherEntity(BaseModel):
    type: Literal["지역", "기온", "강수형태", "강수량", "풍량", "풍속", "하늘상태", "습도", "낙뢰"]
    value: str

class DustEntity(BaseModel):
    type: Literal["미세먼지", "초미세먼지"]
    value: str

# Intent 의도 타입 제한
class WeatherIntent(BaseModel):
    intent: Literal["날씨", "미세먼지"]
    