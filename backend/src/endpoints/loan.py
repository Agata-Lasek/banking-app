from fastapi import (
    APIRouter,
    HTTPException,
    status
)

from src.dependencies import (
    SessionDep,
    CurrentCustomerDep,
    ValidLoanOwnerDep
)
from src import crud
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


@router.post(
    "",
    summary="Take a loan",
    response_model=Loan,
    status_code=status.HTTP_201_CREATED
)
def take_loan(
        loan_take: LoanTake,
        session: SessionDep,
        current_customer: CurrentCustomerDep
) -> Loan:
    allowed = any([
        account.number == loan_take.account
        for account in current_customer.accounts
    ])
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to take a loan for this account"
        )

    account = crud.account.get_account_by_number(session, loan_take.account)
    if account.type != AccountType.CHECKING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can take a loan only for checking account"
        )
    loan = crud.loan.handle_take_loan(session, account, loan_take.amount)
    session.commit()
    return loan


@router.get(
    "/{loan_id}",
    summary="Get loan details",
    response_model=Loan,
)
def get_loan(loan: ValidLoanOwnerDep) -> Loan:
    return loan


@router.post(
    "/{loan_id}/payoff",
    summary="Payoff a loan",
    response_model=Loan
)
def payoff_loan(
        loan_payoff: LoanPayoff,
        loan: ValidLoanOwnerDep,
        current_customer: CurrentCustomerDep,
        session: SessionDep,
) -> Loan:
    if loan.paid_at is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This loan is already paid off"
        )

    account = crud.account.get_account_by_number(session, loan_payoff.account)
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account not found"
        )
    if account.customer_id != current_customer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You're not allowed to use this account to payoff this loan"
        )
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
