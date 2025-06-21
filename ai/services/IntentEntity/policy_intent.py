from pydantic import BaseModel
from typing import Literal

class PolicyIntent(BaseModel):
    intent: Literal["민원 요청"]
