from pydantic import BaseModel, Field, field_validator, ValidationInfo
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
    pin: Optional[str] = Field(None, exclude=True)

    class ConfigDict:
        from_attributes = True


class Card(CardInDB):
    active: Optional[bool] = Field(None, validate_default=True)

    @field_validator("active", mode="before")
    def prepare_active(cls, _: Optional[bool], info: ValidationInfo) -> bool:
        pin = info.data.get("pin")
        return isinstance(pin, str) and bool(pin)
