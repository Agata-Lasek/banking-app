from fastapi import (
    APIRouter,
    HTTPException,
    status,
    Depends,
    Query
)
from typing import Annotated

from src.schemas import (
    Account,
    TransferCreate,
    Transaction,
    TransactionParams,
    Card,
    GenericMultipleItems
)
from src.dependencies import SessionDep, ValidAccountOwnerDep
from src.models import AccountType
from src import crud

router = APIRouter(
    prefix="/accounts",
    tags=["accounts"],
)

MAX_ACTIVE_CARDS_PER_ACCOUNT = 3


@router.get(
    "/{account_id}",
    summary="Get bank account details",
    response_model=Account
)
def get_account_by_id(account: ValidAccountOwnerDep) -> Account:
    return account


@router.post(
    "/{account_id}/transfer",
    summary="Transfer funds between two bank accounts",
    description="Transfer can be internal (between two accounts existing in the system) or external.",
    response_model=Transaction
)
def transfer_funds(
        transfer_in: TransferCreate,
        account: ValidAccountOwnerDep,
        session: SessionDep
) -> Transaction:
    if account.balance < transfer_in.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient funds"
        )

    receiver_account = crud.account.get_account_by_number(session, transfer_in.receiver)
    if receiver_account is not None:
        transaction = crud.transaction.handle_internal_transfer(
            session, account, receiver_account, transfer_in.amount, transfer_in.description
        )
    else:
        transaction = crud.transaction.handle_external_transfer(
            session, account, transfer_in.amount, transfer_in.description
        )
    session.commit()
    return transaction


@router.get(
    "/{account_id}/transactions",
    summary="Get bank account transactions",
    response_model=GenericMultipleItems[Transaction]
)
def get_account_transactions(
        account_id: int,
        params: TransactionParams = Depends(),
        *,
        session: SessionDep,
        _: ValidAccountOwnerDep
) -> GenericMultipleItems[Transaction]:
    transactions = crud.transaction.get_account_transactions_by_filter(session, account_id, params)
    return GenericMultipleItems[Transaction](items=[Transaction(**vars(t)) for t in transactions])


@router.get(
    "/{account_id}/cards",
    summary="Get bank account cards",
    response_model=GenericMultipleItems[Card]
)
def get_account_cards(
        account_id: int,
        expired: Annotated[bool, Query(description="List expired cards")] = True,
        blocked: Annotated[bool, Query(description="List blocked cards")] = True,
        offset: int = 0,
        limit: int = 30,
        *,
        session: SessionDep,
        _: ValidAccountOwnerDep
) -> GenericMultipleItems[Card]:
    cards = crud.card.get_account_cards(session, account_id, expired, blocked, offset, limit)
    return GenericMultipleItems[Card](items=[Card(**vars(c)) for c in cards])


@router.post(
    "/{account_id}/cards",
    summary="Create new card for bank account",
    response_model=Card
)
def create_account_card(
        account_id: int,
        session: SessionDep,
        account: ValidAccountOwnerDep
) -> Card:
    if account.type == AccountType.SAVING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only checking and foreign currency accounts can have cards"
        )
    cards = crud.card.get_account_cards(
        session, account_id, expired=False, blocked=False, offset=0, limit=MAX_ACTIVE_CARDS_PER_ACCOUNT
    )
    if len(cards) >= MAX_ACTIVE_CARDS_PER_ACCOUNT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Account can have maximum {MAX_ACTIVE_CARDS_PER_ACCOUNT} cards"
        )
    card = crud.card.create_card(session, account_id)
    session.commit()
    return card
