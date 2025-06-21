from pydantic import BaseModel
from typing import Literal

class AdministrativeIntent(BaseModel):
    intent: Literal["민원 요청"]