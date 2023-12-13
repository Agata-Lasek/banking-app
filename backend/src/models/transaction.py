from sqlalchemy.orm import (
    Mapped,
    mapped_column
)
from sqlalchemy import (
    ForeignKey,
    Numeric,
    DateTime,
)
from sqlalchemy import func
from datetime import datetime
from enum import Enum

from src.core import Base


class TransactionType(str, Enum):
    DEPOSIT = "Deposit"
    WITHDRAWAL = "Withdrawal"
    TRANSFER_IN = "Transfer in"
    TRANSFER_OUT = "Transfer out"
    LOAN_TAKE = "Loan take"
    LOAN_PAYOFF = "Loan payoff"


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"), unique=True, index=True)
    balance_before: Mapped[float] = mapped_column(Numeric(12, 2))
    balance_after: Mapped[float] = mapped_column(Numeric(12, 2))
    description: Mapped[str]
    type: Mapped[TransactionType]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now())
