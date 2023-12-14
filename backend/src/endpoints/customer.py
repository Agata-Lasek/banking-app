from fastapi import (
    APIRouter,
    HTTPException,
    status
)

from src.dependencies import (
    SessionDep,
    CurrentCustomerDep
)
from src.schemas import (
    Customer,
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


@router.post(
    "",
    summary="Create a new customer customer",
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
    summary="Get a customer details associated with the specified customer",
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


@router.get(
    "/{customer_id}/accounts",
    summary="Get all accounts associated with the specified customer",
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


@router.get(
    "/{customer_id}/loans",
    summary="Get all loans associated with the specified customer",
    response_model=list[Loan]
)
def get_all_customer_loans(
        customer_id: int,
        *,
        session: SessionDep,
        current_customer: CurrentCustomerDep
) -> list[Loan]:
    if customer_id != current_customer.id:
        raise HTTP403Exception()
    loans = crud.loan.get_customer_loans(session, current_customer.id)
    return loans
