from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)
from sqlalchemy import (
    String,
    ForeignKey,
    Numeric,
    DateTime,
)
from sqlalchemy import func
from datetime import datetime
from enum import Enum

from src.core import Base


class Currency(str, Enum):
    PLN = "PLN"
    EUR = "EUR"
    USD = "USD"
    GBP = "GBP"


class AccountType(str, Enum):
    CHECKING = "Checking"
    SAVING = "Saving"
    FOREIGN_CURRENCY = "Foreign currency"


class Account(Base):
    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    customer: Mapped["Customer"] = relationship(back_populates="accounts")
    number: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    balance: Mapped[float] = mapped_column(Numeric(12, 2))
    currency: Mapped[Currency]
    type: Mapped[AccountType]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now())
    transactions: Mapped[list["Transaction"]] = relationship(back_populates="account")
    cards: Mapped[list["Card"]] = relationship(back_populates="account")
