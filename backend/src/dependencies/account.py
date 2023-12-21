from fastapi import (
    Depends,
    HTTPException,
    status
)
from typing import Annotated

from src.dependencies import SessionDep, CurrentCustomerDep
from src import crud
from src.models import Account


def valid_account_owner(
        account_id: int,
        session: SessionDep,
        customer: CurrentCustomerDep,
) -> Account:
    """
    Validate that the customer owns the account and return the account object.
    """
    account = crud.account.get_account_by_id(session, account_id)
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    allowed = any([
        account.id == account_id
        for account in customer.accounts
    ])
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You're not allowed to access this account"
        )
    return account


ValidAccountOwnerDep = Annotated[Account, Depends(valid_account_owner)]
