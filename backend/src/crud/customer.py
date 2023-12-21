from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import select
from typing import Optional
from pydantic import EmailStr

from src.schemas import CustomerCreate, CustomerUpdate
from src.models import Customer
from src.core import security


def get_customer_by_id(session: Session, id: int) -> Optional[Customer]:
    return session.get(Customer, id)


def get_customer_by_email(session: Session, email: EmailStr) -> Optional[Customer]:
    return session.execute(
        select(Customer).where(Customer.email == email)
    ).scalar_one_or_none()


def create_customer(session: Session, customer_in: CustomerCreate) -> Customer:
    hashed = security.get_hash(
        customer_in.password
    )
    customer = Customer(
        name=customer_in.name,
        surname=customer_in.surname,
        email=customer_in.email,
        phone=customer_in.phone,
        password=hashed
    )
    session.add(customer)
    session.flush()
    session.refresh(customer)
    return customer


def update_customer(session: Session, customer: Customer, customer_in: CustomerUpdate) -> Customer:
    customer.surname = customer_in.surname or customer.surname
    customer.email = customer_in.email or customer.email
    customer.phone = customer_in.phone or customer.phone
    session.flush()
    session.refresh(customer)
    return customer


def authenticate_customer(session: Session, email: str, password: str) -> Optional[Customer]:
    """
    Authenticate a customer by email and password.

    Returns:
        Customer if email and password match, else None
    """
    customer = get_customer_by_email(session, email)
    if customer is not None:
        mismatch = not security.verify(password, customer.password)
        if mismatch:
            customer = None
    return customer
