from fastapi import APIRouter, Query, Depends

from src.dependencies import SessionDep, CurrentCustomerDep
from src.schemas import (
    Customer,
    CustomerUpdate,
    Loan,
    Account,
    Transaction,
    TransactionParams,
    GenericMultipleItems
)
from src import crud

router = APIRouter(
    prefix="/me",
    tags=["self"],
)


@router.get(
    "",
    summary="Get current customer details",
    response_model=Customer
)
def get_current_customer(
        *,
        customer: CurrentCustomerDep
) -> Customer:
    return customer


@router.put(
    "",
    summary="Update current customer details",
    response_model=Customer
)
def update_current_customer(
        *,
        customer_in: CustomerUpdate,
        session: SessionDep,
        customer: CurrentCustomerDep
) -> Customer:
    customer = crud.customer.update_customer(session, customer, customer_in)
    session.commit()
    return customer


@router.get(
    "/accounts",
    summary="Get current customer accounts",
    response_model=GenericMultipleItems[Account]
)
def get_current_customer_accounts(
        session: SessionDep,
        customer: CurrentCustomerDep
) -> GenericMultipleItems[Account]:
    accounts = crud.account.get_customer_accounts(session, customer.id)
    return GenericMultipleItems[Account](items=[Account(**vars(a)) for a in accounts])


@router.get(
    "/transactions",
    summary="Get current customer transactions",
    response_model=GenericMultipleItems[Transaction]
)
def get_current_customer_transactions(
        params: TransactionParams = Depends(),
        *,
        session: SessionDep,
        customer: CurrentCustomerDep
) -> GenericMultipleItems[Transaction]:
    transactions = crud.transaction.get_customer_transactions_by_filter(session, customer.id, params)
    return GenericMultipleItems[Transaction](items=[Transaction(**vars(t)) for t in transactions])


@router.get(
    "/loans",
    summary="Get current customer loans",
    response_model=GenericMultipleItems[Loan]
)
def get_current_customer_loans(
        paidoff: bool = Query(False, description="List also paid off loans"),
        *,
        session: SessionDep,
        customer: CurrentCustomerDep
) -> GenericMultipleItems[Loan]:
    loans = crud.loan.get_customer_loans(session, customer.id, paidoff)
    return GenericMultipleItems[Loan](items=[Loan(**vars(l)) for l in loans])
