from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import (
    ForeignKey,
    Numeric,
    DateTime,
)
from sqlalchemy import func
from datetime import datetime

from src.core import Base


class Loan(Base):
    __tablename__ = "loans"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    amount: Mapped[float] = mapped_column(Numeric(12, 2))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now())
    paid_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
