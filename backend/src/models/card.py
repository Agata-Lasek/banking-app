from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)
from sqlalchemy import (
    String,
    ForeignKey,
    DateTime,
)
from sqlalchemy import func
from datetime import datetime

from src.core import Base


class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"), index=True)
    account: Mapped["Account"] = relationship(back_populates="cards")
    number: Mapped[str] = mapped_column(String(32), unique=True)
    cvv: Mapped[str] = mapped_column(String(3))
    pin: Mapped[str] = mapped_column(nullable=True)
    expiry_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now())
    blocked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
