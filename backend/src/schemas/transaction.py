from pydantic import BaseModel, Field
from fastapi import Query
from datetime import datetime
from typing import Optional, Literal
from dataclasses import dataclass

from src.models import TransactionType


@dataclass
class TransactionParams:
    start_date: Optional[datetime] = Query(
        None,
        description="Start date of the period to filter transactions (isoformat described in RFC3339)",
        alias="startDate"
    )
    end_date: Optional[datetime] = Query(
        None,
        description="End date of the period to filter transactions (isoformat described in RFC3339)",
        alias="endDate"
    )
    type: Optional[Literal["deposit", "withdrawal", "transferin", "transferout", "loantake", "loanpayoff"]] = Query(
        None,
        description="Type of transactions to filter (allowed types: deposit, withdrawal, transferin, transferout, "
                    "loantake, loanpayoff)",
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
