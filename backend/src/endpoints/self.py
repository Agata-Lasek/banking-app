from fastapi import APIRouter, Query

from src.dependencies import SessionDep, CurrentCustomerDep
from src.schemas import (
    Customer,
    Account,
    Loan
)
from src import crud

router = APIRouter(
    prefix="/me",
    tags=["self"],
)


@router.get(
    "",
    summary="Get the current customer details",
    response_model=Customer
)
def get_current_customer(
        *,
        session: SessionDep,
        customer: CurrentCustomerDep
) -> Customer:
    return customer


@router.get(
    "/accounts",
    summary="Get all current customer accounts",
    response_model=list[Account]
)
def get_current_customer_accounts(
        *,
        session: SessionDep,
        customer: CurrentCustomerDep
) -> list[Account]:
    return crud.account.get_customer_accounts(session, customer.id)


@router.get(
    "/loans",
    summary="Get all current customer loans",
    response_model=list[Loan]
)
def get_current_customer_loans(
        paidoff: bool = Query(False, description="List also paid off loans"),
        *,
        session: SessionDep,
        customer: CurrentCustomerDep
) -> list[Loan]:
    return crud.loan.get_customer_loans(session, customer.id, paidoff)
