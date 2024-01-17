from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import select, Select
from typing import Optional
from datetime import (
    datetime,
    timezone,
    timedelta
)

from src.models import Card
from src.core import security
from src.utils import generate_account_number, generate_cvv

DEFAULT_EXPIRY_YEARS = 3


def get_card_by_id(session: Session, id: int) -> Optional[Card]:
    return session.get(Card, id)


def get_card_by_account_id(session: Session, account_id: int) -> Optional[Card]:
    return session.execute(
        select(Card).where(Card.account_id == account_id)
    ).scalar_one_or_none()


def get_filtered_cards(
        session: Session,
        statement: Select,
        expired: bool,
        blocked: bool,
        offset: int,
        limit: int
) -> list[Card]:
    """
    Get a list of cards for init statement.

    Returns:
        List of cards ordered by expiry date in descending order.
    """
    if not expired:
        statement = statement.where(Card.expiry_at > datetime.now(timezone.utc))
    if not blocked:
        statement = statement.where(Card.blocked_at.is_(None))

    statement = (
        statement
        .offset(offset)
        .limit(limit)
        .order_by(Card.expiry_at.desc())
    )
    return list(session.execute(statement).scalars().all())


def get_customer_cards(
        session: Session,
        customer_id: int,
        expired: bool,
        blocked: bool,
        offset: int,
        limit: int
) -> list[Card]:
    statement = select(Card).join(Card.account).where(Card.account.has(customer_id=customer_id))
    return get_filtered_cards(session, statement, expired, blocked, offset, limit)


def get_account_cards(
        session: Session,
        account_id: int,
        expired: bool,
        blocked: bool,
        offset: int,
        limit: int
) -> list[Card]:
    statement = select(Card).where(Card.account_id == account_id)
    return get_filtered_cards(session, statement, expired, blocked, offset, limit)


def create_card(session: Session, account_id: int) -> Card:
    card = Card(
        account_id=account_id,
        number=generate_account_number(),
        cvv=generate_cvv(),
        expiry_at=datetime.now(timezone.utc) + timedelta(days=DEFAULT_EXPIRY_YEARS * 365)
    )
    session.add(card)
    session.flush()
    session.refresh(card)
    return card


def activate_card(session, card: Card, pin: str) -> Card:
    card.pin = security.get_hash(pin)
    session.flush()
    session.refresh(card)
    return card


def block_card(session: Session, card: Card) -> Card:
    card.blocked_at = datetime.now(timezone.utc)
    session.flush()
    session.refresh(card)
    return card


def unblock_card(session: Session, card: Card) -> Card:
    card.blocked_at = None
    session.flush()
    session.refresh(card)
    return card
