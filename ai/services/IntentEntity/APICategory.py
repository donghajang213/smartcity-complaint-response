from pydantic import BaseModel
from typing import Literal

class APICategory(BaseModel):
    category: Literal["교통", "환경", "날씨", "행정", "시설", "정책", "일상 대화"]