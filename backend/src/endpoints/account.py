from fastapi import (
    APIRouter,
    HTTPException,
    status,
    Depends
)
from src.schemas import (
    Account,
    AccountCreate,
    TransferCreate,
    Transaction,
    TransactionParams
)
from src.dependencies import SessionDep, CurrentCustomerDep
from src import crud
from src.endpoints.exceptions import HTTP403Exception, HTTP404Exception

router = APIRouter(
    prefix="/accounts",
    tags=["accounts"],
)


@router.get(
    "/{account_id}",
    summary="Get bank account details",
    response_model=Account
)
def get_account_by_id(
        account_id: int,
        *,
        session: SessionDep,
        current_customer: CurrentCustomerDep,
) -> Account:
    account = crud.account.get_account_by_id(session, account_id)
    if account is None:
        raise HTTP404Exception()
    if account.customer_id != current_customer.id:
        raise HTTP403Exception()
    account = crud.account.get_account_by_id(session, account_id)
    return account


@router.post(
    "/{account_id}/transfer",
    summary="Transfer funds between two bank accounts",
    description="Transfer can be internal (between two accounts existing in the system) or external.",
    response_model=Transaction
)
def transfer_funds(
        account_id: int,
        *,
        transfer_in: TransferCreate,
        current_customer: CurrentCustomerDep,
        session: SessionDep
) -> Transaction:
    sender_account = crud.account.get_account_by_id(session, account_id)
    if sender_account is None:
        raise HTTP404Exception()
    if sender_account.customer_id != current_customer.id:
        raise HTTP403Exception(detail="You are not allowed to transfer funds from this account")

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


@router.get(
    "/{account_id}/transactions",
    summary="Get bank account transactions",
    response_model=list[Transaction]
)
def get_account_transactions(
        account_id: int,
        params: TransactionParams = Depends(),
        *,
        session: SessionDep,
        current_customer: CurrentCustomerDep
) -> list[Transaction]:
    account = crud.account.get_account_by_id(session, account_id)
    if account is None:
        raise HTTP404Exception()
    if account.customer_id != current_customer.id:
        raise HTTP403Exception()
    transactions = crud.transaction.get_account_transactions_by_filter(session, account_id, params)
    return transactions
