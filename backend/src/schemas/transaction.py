from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

from src.models import TransactionType


class TransactionParams(BaseModel):
    start: Optional[datetime] = Field(
        None,
        description="Start date (isoformat described in RFC3339) of the period to filter transactions"
    )
    end: Optional[datetime] = Field(
        None,
        description="End date (isoformat described in RFC3339) of the period to filter transactions"
    )
    type: Optional[TransactionType] = Field(
        None,
        examples=[TransactionType.TRANSFER_IN, TransactionType.TRANSFER_OUT]
    )
    offset: int = 0
    limit: int = 30


class TransactionBase(BaseModel):
    account_id: int = Field(..., serialization_alias="accountId")
    balance_before: float = Field(..., serialization_alias="balanceBefore")
    balance_after: float = Field(..., serialization_alias="balanceAfter")
    description: str = Field(..., max_length=255)
    type: TransactionType


class TransactionInDB(TransactionBase):
    id: int
    created_at: datetime = Field(..., serialization_alias="createdAt")

    class ConfigDict:
        from_attributes = True


class Transaction(TransactionInDB):
    ...
