from fastapi import (
    APIRouter,
    HTTPException,
    status
)

from src.dependencies import SessionDep, CurrentCustomerDep
from src.schemas import (
    Customer,
    CustomerCreate
)
from src import crud

router = APIRouter(
    prefix="/customers",
    tags=["customers"],
)


@router.post("", response_model=Customer)
def create_customer(
        *,
        session: SessionDep,
        customer_in: CustomerCreate
) -> Customer:
    customer = crud.customer.get_customer_by_email(session, customer_in.email)
    if customer is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The customer with this email already exists in the system"
        )
    customer = crud.customer.create_customer(session, customer_in)
    session.commit()
    session.refresh(customer)
    return customer


@router.get("/me")
def read_customer_me(
        session: SessionDep,
        customer: CurrentCustomerDep
) -> Customer:
    return customer
