from fastapi import (
    Depends,
    HTTPException,
    status
)
from typing import Annotated

from src.dependencies import CurrentCustomerDep
from src.models import Customer


def valid_customer(customer_id: int, customer: CurrentCustomerDep) -> Customer:
    """
    Validate that the customer owns the customer and return the customer object.
    """
    if customer_id != customer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You're not allowed to create an account for this customer"
        )
    return customer


ValidCustomerDep = Annotated[Customer, Depends(valid_customer)]
