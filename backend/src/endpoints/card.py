from fastapi import (
    APIRouter,
    HTTPException,
    status,
    Body
)
from decimal import Decimal

from src.dependencies import (
    SessionDep,
    ValidCardOwnerDep,
    UsableCardDep
)
from src.schemas import Card, Transaction
from src.models import TransactionType
from src.core import security
from src import crud

router = APIRouter(
    prefix="/cards",
    tags=["cards"],
)

MAX_DEPOSIT_FOUNDS_PER_DAY = 10_000
MAX_WITHDRAW_FOUNDS_PER_DAY = 10_000


@router.get(
    "/{card_id}",
    summary="Get card details",
    response_model=Card
)
def get_card_details(card: ValidCardOwnerDep) -> Card:
    return card


@router.put(
    "/{card_id}/activate",
    summary="Activate card",
    response_model=Card
)
def activate_card(
        *,
        pin: str = Body(..., min_length=4, max_length=4, embed=True),
        session: SessionDep,
        card: ValidCardOwnerDep
) -> Card:
    if card.pin is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Card is already activated"
        )
    card = crud.card.activate_card(session, card, pin)
    session.commit()
    return card


@router.put(
    "/{card_id}/block",
    summary="Block card",
    response_model=Card
)
def block_card(session: SessionDep, card: ValidCardOwnerDep) -> Card:
    if card.blocked_at is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Card is already blocked"
        )
    card = crud.card.block_card(session, card)
    session.commit()
    return card


@router.put(
    "/{card_id}/unblock",
    summary="Unblock card",
    response_model=Card
)
def unblock_card(session: SessionDep, card: ValidCardOwnerDep) -> Card:
    if card.blocked_at is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Card is not blocked"
        )
    card = crud.card.unblock_card(session, card)
    session.commit()
    return card


@router.post(
    "/{card_id}/withdraw",
    summary="Withdraw money from ATM",
    response_model=Transaction
)
def withdraw_money(
        *,
        amount: Decimal = Body(..., gt=0),
        pin: str = Body(..., min_length=4, max_length=4),
        session: SessionDep,
        card: UsableCardDep
) -> Transaction:
    if not security.verify(pin, card.pin):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect PIN"
        )
    if card.account.balance < amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient funds"
        )
    total = crud.transaction.get_transactions_sum_within_24_hours(session, card.account_id, TransactionType.WITHDRAWAL)
    if abs(total) + amount > MAX_WITHDRAW_FOUNDS_PER_DAY:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You can withdraw up to {MAX_WITHDRAW_FOUNDS_PER_DAY} {card.account.currency.value} per day"
        )
    transaction = crud.transaction.handle_withdrawal(session, card.account, amount)
    session.commit()
    return transaction


@router.post(
    "/{card_id}/deposit",
    summary="Deposit money to ATM",
    response_model=Transaction
)
def deposit_money(
        *,
        amount: Decimal = Body(..., gt=0),
        pin: str = Body(..., min_length=4, max_length=4),
        session: SessionDep,
        card: UsableCardDep
) -> Transaction:
    if not security.verify(pin, card.pin):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect PIN"
        )
    total = crud.transaction.get_transactions_sum_within_24_hours(session, card.account_id, TransactionType.DEPOSIT)
    if total + amount > MAX_DEPOSIT_FOUNDS_PER_DAY:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You can deposit up to {MAX_DEPOSIT_FOUNDS_PER_DAY} {card.account.currency.value} per day"
        )
    transaction = crud.transaction.handle_deposit(session, card.account, amount)
    session.commit()
    return transaction
