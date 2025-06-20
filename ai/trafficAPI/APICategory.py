from pydantic import BaseModel
from typing import Literal

class APICategory(BaseModel):
    category: Literal["교통", "환경"]