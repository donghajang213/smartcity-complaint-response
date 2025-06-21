from pydantic import BaseModel
from typing import Literal

class DustEntity(BaseModel):
    type: Literal["지역","미세먼지", "초미세먼지"]
    value: str

class DustIntent(BaseModel):
    intent: Literal["미세먼지", "민원 요청"]