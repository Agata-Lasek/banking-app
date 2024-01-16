from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class CardBase(BaseModel):
    account_id: int = Field(..., serialization_alias="accountId")
    number: str
    cvv: str
    expiry_at: datetime = Field(..., serialization_alias="expiryAt")


class CardInDB(CardBase):
    id: int
    blocked_at: Optional[datetime] = Field(None, serialization_alias="blockedAt")

    class ConfigDict:
        from_attributes = True


class Card(CardInDB):
    ...
