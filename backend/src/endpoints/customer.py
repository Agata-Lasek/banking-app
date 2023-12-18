from fastapi import (
    APIRouter,
    HTTPException,
    status,
    Query
)

from src.dependencies import (
    SessionDep,
    CurrentCustomerDep
)
from src.schemas import (
    Customer,
    CustomerUpdate,
    Account,
    CustomerCreate,
    AccountCreate,
    Loan
)
from src import crud
from src.endpoints.exceptions import HTTP403Exception, HTTP404Exception

router = APIRouter(
    prefix="/customers",
    tags=["customers"],
)

MAX_ACCOUNTS_PER_CUSTOMER = 5


@router.post(
    "",
    summary="Create a new customer",
    description="Create a new customer and an account for them.",
    response_model=Customer,
    status_code=status.HTTP_201_CREATED
)
def create_customer(
        *,
        session: SessionDep,
        customer_in: CustomerCreate
) -> Customer:
    customer = crud.customer.get_customer_by_email(session, customer_in.email)
    if customer is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Customer with this email already exists"
        )
    customer = crud.customer.create_customer(session, customer_in)
    session.flush()
    _ = crud.account.create_account(
        session=session,
        account_in=AccountCreate(),
        customer_id=customer.id
    )
    session.commit()
    return customer


@router.get(
    "/{customer_id}",
    summary="Get customer details",
    response_model=Customer
)
def get_customer_by_id(
        customer_id: int,
        *,
        session: SessionDep,
        current_customer: CurrentCustomerDep
) -> Customer:
    if customer_id != current_customer.id:
        raise HTTP403Exception()
    customer = crud.customer.get_customer_by_id(session, customer_id)
    return customer


@router.put(
    "/{customer_id}",
    summary="Update customer details",
    response_model=Customer
)
def update_customer(
        customer_id: int,
        *,
        customer_in: CustomerUpdate,
        session: SessionDep,
        current_customer: CurrentCustomerDep
) -> Customer:
    if customer_id != current_customer.id:
        raise HTTP403Exception()
    customer = crud.customer.get_customer_by_id(session, customer_id)
    if customer is None:
        raise HTTP404Exception()
    customer = crud.customer.update_customer(session, customer, customer_in)
    session.commit()
    return customer


@router.get(
    "/{customer_id}/accounts",
    summary="Get customer accounts",
    response_model=list[Account]
)
def get_all_customer_accounts(
        customer_id: int,
        *,
        session: SessionDep,
        current_customer: CurrentCustomerDep
) -> list[Account]:
    if customer_id != current_customer.id:
        raise HTTP403Exception()
    accounts = crud.account.get_customer_accounts(session, current_customer.id)
    return accounts


@router.post(
    "/{customer_id}/accounts",
    summary="Create new bank account",
    response_model=Account,
    status_code=status.HTTP_201_CREATED
)
def create_account(
        customer_id: int,
        *,
        session: SessionDep,
        current_customer: CurrentCustomerDep,
        account_in: AccountCreate
) -> Account:
    if customer_id != current_customer.id:
        raise HTTP403Exception(detail="You are not allowed to create an account for this customer")

    accounts = crud.account.get_customer_accounts(session, customer_id)
    if len(accounts) >= MAX_ACCOUNTS_PER_CUSTOMER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"The maximum number of accounts per customer ({MAX_ACCOUNTS_PER_CUSTOMER}) has been reached"
        )
    account = crud.account.create_account(
        session=session,
        account_in=account_in,
        customer_id=customer_id
    )
    session.commit()
    return account


@router.get(
    "/{customer_id}/loans",
    summary="Get customer loans",
    response_model=list[Loan]
)
def get_all_customer_loans(
        customer_id: int,
        paidoff: bool = Query(False, description="List also paid off loans"),
        *,
        session: SessionDep,
        current_customer: CurrentCustomerDep
) -> list[Loan]:
    if customer_id != current_customer.id:
        raise HTTP403Exception()
    loans = crud.loan.get_customer_loans(session, current_customer.id, paidoff)
    return loans
