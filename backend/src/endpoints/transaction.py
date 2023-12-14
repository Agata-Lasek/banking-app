from fastapi import (
    APIRouter,
    HTTPException,
    status
)

from src.dependencies import SessionDep, CurrentCustomerDep
from src import crud
from src.endpoints.exceptions import HTTP403Exception
from src.schemas import Transaction, TransferCreate

router = APIRouter(
    prefix="/transactions",
    tags=["transactions"],
)


@router.post(
    "/transfer",
    summary="Transfer funds between two accounts",
    description="Transfer can be internal (between two accounts existing in the system) or external.",
    response_model=Transaction,
    status_code=status.HTTP_201_CREATED
)
def transfer_funds(
        *,
        session: SessionDep,
        current_customer: CurrentCustomerDep,
        transfer_in: TransferCreate
) -> Transaction:
    current_customer_accounts = crud.account.get_customer_accounts(session, current_customer.id)
    allowed = any([account.number == transfer_in.sender for account in current_customer_accounts])
    if not allowed:
        raise HTTP403Exception(detail="You are not allowed to transfer funds from this account")

    sender_account = crud.account.get_account_by_number(session, transfer_in.sender)
    if sender_account.balance < transfer_in.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient funds"
        )

    receiver_account = crud.account.get_account_by_number(session, transfer_in.receiver)
    if receiver_account is not None:
        transaction = crud.transaction.handle_internal_transfer(
            session, sender_account, receiver_account, transfer_in.amount, transfer_in.description
        )
    else:
        transaction = crud.transaction.handle_external_transfer(
            session, sender_account, transfer_in.amount, transfer_in.description
        )
    session.commit()
    return transaction
