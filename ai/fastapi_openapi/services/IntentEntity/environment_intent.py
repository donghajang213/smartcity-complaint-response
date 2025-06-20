from pydantic import BaseModel, root_validator
from typing import List, Union, Literal

class DustEntity(BaseModel):
    type: Literal["지역","미세먼지", "초미세먼지"]
    value: str

class DustIntent(BaseModel):
    intent: Literal["미세먼지"]