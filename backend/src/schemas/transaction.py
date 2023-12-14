from pydantic import BaseModel, Field
from datetime import datetime

from src.models import TransactionType


class TransferCreateBase(BaseModel):
    amount: float = Field(..., gt=0)
    sender: str = Field(..., min_length=26, max_length=26)
    description: str = Field(..., max_length=255)


class TransferCreate(TransferCreateBase):
    receiver: str = Field(..., min_length=26, max_length=26)
    description: str = Field(default="Funds transfer", max_length=255)


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
