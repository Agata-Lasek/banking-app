from fastapi import (
    Depends,
    HTTPException,
    status
)
from typing import Annotated

from src.dependencies import SessionDep, CurrentCustomerDep
from src import crud
from src.models import Loan


def valid_loan_owner(
        loan_id: int,
        session: SessionDep,
        customer: CurrentCustomerDep,
) -> Loan:
    """
    Validate that the customer owns the loan and return the loan object.
    """
    loan = crud.loan.get_loan_by_id(session, loan_id)
    if loan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found"
        )
    if loan.customer_id != customer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You're not allowed to access this account"
        )
    return loan


ValidLoanOwnerDep = Annotated[Loan, Depends(valid_loan_owner)]
