from fastapi import (
    APIRouter,
    HTTPException,
    status
)

from src.dependencies import SessionDep, CurrentCustomerDep
from src import crud
from src.endpoints.exceptions import HTTP403Exception
from src.schemas import (
    Loan,
    LoanTake,
    LoanPayoff
)
from src.models import AccountType

router = APIRouter(
    prefix="/loans",
    tags=["loans"],
)


@router.get(
    "/{loan_id}",
    summary="Get a loan details associated with the specified loan",
    response_model=Loan,
)
def get_loan(
        loan_id: int,
        session: SessionDep,
        current_customer: CurrentCustomerDep
) -> Loan:
    loan = crud.loan.get_loan_by_id(session, loan_id)
    if loan.customer_id != current_customer.id:
        raise HTTP403Exception()
    return loan


@router.post(
    "/take",
    summary="Take a loan",
    response_model=Loan,
    status_code=status.HTTP_201_CREATED
)
def take_loan(
        loan_take: LoanTake,
        session: SessionDep,
        current_customer: CurrentCustomerDep
) -> Loan:
    current_customer_accounts = crud.account.get_customer_accounts(session, current_customer.id)
    allowed = any([account.number == loan_take.account for account in current_customer_accounts])
    if not allowed:
        raise HTTP403Exception(detail="You are not allowed to take a loan for this account")

    account = crud.account.get_account_by_number(session, loan_take.account)
    if account.type != AccountType.CHECKING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can take a loan only for checking account"
        )

    loan = crud.loan.handle_take_loan(session, account, loan_take.amount)
    session.commit()
    return loan


@router.post(
    "/{loan_id}/payoff",
    summary="Payoff a loan",
    response_model=Loan
)
def payoff_loan(
        loan_id: int,
        *,
        loan_payoff: LoanPayoff,
        session: SessionDep,
        current_customer: CurrentCustomerDep
) -> Loan:
    current_customer_accounts = crud.account.get_customer_accounts(session, current_customer.id)
    allowed = any([account.number == loan_payoff.account for account in current_customer_accounts])
    if not allowed:
        raise HTTP403Exception(detail="You are not allowed to use this account for payoff")

    loan = crud.loan.get_loan_by_id(session, loan_id)
    if loan.customer_id != current_customer.id:
        raise HTTP403Exception(detail="You are not allowed to payoff this loan")
    if loan.paid_at is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This loan is already paid off"
        )

    account = crud.account.get_account_by_number(session, loan_payoff.account)
    if account.type != AccountType.CHECKING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can payoff a loan only from checking account"
        )
    if account.balance < loan.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient funds on the account"
        )
    paidoff_loan = crud.loan.handle_payoff_loan(session, loan, account)
    session.commit()
    return paidoff_loan
