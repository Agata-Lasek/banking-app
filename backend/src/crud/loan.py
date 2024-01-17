from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import select
from typing import Optional
from decimal import Decimal
from datetime import datetime, timezone

from src.models import (
    Account,
    Loan,
    TransactionType
)
from src.crud.transaction import create_transaction


def get_loan_by_id(session: Session, loan_id: int) -> Optional[Loan]:
    return session.get(Loan, loan_id)


def get_customer_loans(
        session: Session,
        customer_id: int,
        paidoff: bool,
        offset: int,
        limit: int
) -> list[Loan]:
    statement = (
        select(Loan)
        .where(Loan.customer_id == customer_id)
        .offset(offset)
        .limit(limit)
        .order_by(Loan.created_at.desc())
    )
    if not paidoff:
        statement = statement.where(Loan.paid_at.is_(None))
    return list(session.execute(statement).scalars().all())


def create_loan(
        session: Session,
        customer_id: int,
        amount: float
) -> Loan:
    loan = Loan(
        customer_id=customer_id,
        amount=amount
    )
    session.add(loan)
    session.flush()
    session.refresh(loan)
    return loan


def handle_take_loan(session: Session, account: Account, amount: float) -> Loan:
    """
    Take a loan for a given customer related to the specified account, update the account balance,
    create a transaction and return the loan created.
    """
    loan = create_loan(session, account.customer_id, amount)
    _ = create_transaction(
        session, account.id, account.balance, account.balance + Decimal(amount),
        "Funds transfer related to the taken loan", TransactionType.LOAN_TAKE
    )
    account.balance = account.balance + Decimal(amount)
    session.flush()
    return loan


def handle_payoff_loan(session: Session, loan: Loan, account: Account) -> Loan:
    """
    Payoff a loan for a given customer related to the specified
    account, update the account balance, create a transaction
    and return the updated loan.
    """
    _ = create_transaction(
        session, account.id, account.balance, account.balance - Decimal(loan.amount),
        "Loan payoff", TransactionType.LOAN_PAYOFF
    )
    account.balance = account.balance - Decimal(loan.amount)
    loan.paid_at = datetime.now(tz=timezone.utc)
    session.flush()
    session.refresh(loan)
    return loan
