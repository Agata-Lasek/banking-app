from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import select
from typing import Optional

from src.schemas import AccountCreate
from src.models import Account
from src.utils import generate_account_number


def get_account_by_id(session: Session, account_id: int) -> Optional[Account]:
    return session.get(Account, account_id)


def get_account_by_number(session: Session, account_number: str) -> Optional[Account]:
    return session.execute(
        select(Account).where(Account.number == account_number)
    ).scalar_one_or_none()


def get_customer_accounts(session: Session, customer_id: int) -> list[Account]:
    return list(
        session.execute(
            select(Account).where(Account.customer_id == customer_id)
        ).scalars().all()
    )


def create_account(session: Session, account_in: AccountCreate, customer_id: int) -> Account:
    account = Account(
        customer_id=customer_id,
        number=generate_account_number(),
        balance=0,
        currency=account_in.currency,
        type=account_in.type
    )
    session.add(account)
    session.flush()
    session.refresh(account)
    return account


def update_account(session: Session, account_id: int, balance: float) -> Account:
    account = get_account_by_id(session, account_id)
    account.balance = balance
    session.flush()
    session.refresh(account)
    return account
