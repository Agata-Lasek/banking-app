from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional


class LoanBase(BaseModel):
    account: str = Field(..., min_items=26, max_length=26)


class LoanTake(LoanBase):
    amount: float = Field(
        ...,
        ge=1000,
        le=50000,
        examples=[1000, 1500, 49500, 50000],
        description="Amount must be between 1000 and 50000 and be multiple of 500"
    )

    @field_validator("amount", mode="after")
    def validate_amount(cls, v):
        if v % 500 != 0:
            raise ValueError("Amount must be multiple of 500")
        return v


class LoanPayoff(LoanBase):
    account: str = Field(..., min_items=26, max_length=26)


class LoanInDB(BaseModel):
    id: int
    customer_id: int = Field(..., serialization_alias="customerId")
    amount: float
    created_at: datetime = Field(..., serialization_alias="createdAt")
    paid_at: Optional[datetime] = Field(None, serialization_alias="paidAt")


class Loan(LoanInDB):
    ...

