from pydantic import BaseModel
from typing import Literal

class FacilityIntent(BaseModel):
    intent: Literal["민원 요청"]