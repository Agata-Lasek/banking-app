from fastapi import (
    APIRouter,
    HTTPException,
    status
)

from src.schemas import (
    Account,
    AccountCreate,
    Transaction
)
from src.dependencies import SessionDep, CurrentCustomerDep
from src import crud
from src.endpoints.exceptions import HTTP403Exception, HTTP404Exception

router = APIRouter(
    prefix="/accounts",
    tags=["accounts"],
)

MAX_ACCOUNTS_PER_CUSTOMER = 5


@router.post(
    "",
    summary="Create a new banking account",
    response_model=Account
)
def create_account(
        *,
        session: SessionDep,
        current_customer: CurrentCustomerDep,
        account_in: AccountCreate
) -> Account:
    accounts = crud.account.get_customer_accounts(session, current_customer.id)
    if len(accounts) >= MAX_ACCOUNTS_PER_CUSTOMER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"The maximum number of accounts per customer ({MAX_ACCOUNTS_PER_CUSTOMER}) has been reached"
        )
    account = crud.account.create_account(
        session=session,
        account_in=account_in,
        customer_id=current_customer.id
    )
    session.commit()
    return account


@router.get(
    "/{account_id}",
    summary="Get a account details associated with the specified account",
    response_model=Account
)
def get_account_by_id(
        account_id: int,
        *,
        session: SessionDep,
        current_customer: CurrentCustomerDep,
) -> Account:
    accounts = crud.account.get_customer_accounts(session, current_customer.id)
    allowed = any([account.id == account_id for account in accounts])
    if not allowed:
        raise HTTP403Exception()
    account = crud.account.get_account_by_id(session, account_id)
    return account


@router.get(
    "/{account_id}/transactions",
    summary="Get a list of transactions for a given account",
    response_model=list[Transaction]
)
def get_account_transactions(
        account_id: int,
        offset: int = 0,
        limit: int = 30,
        *,
        session: SessionDep,
        current_customer: CurrentCustomerDep
) -> list[Transaction]:
    accounts = crud.account.get_customer_accounts(session, current_customer.id)
    allowed = any([account.id == account_id for account in accounts])
    if not allowed:
        raise HTTP403Exception()
    transactions = crud.transaction.get_account_transactions(
        session=session,
        account_id=account_id,
        offset=offset,
        limit=limit
    )
    return transactions
