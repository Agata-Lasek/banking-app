from sqlalchemy.orm import Session
from decimal import Decimal
from sqlalchemy.sql.expression import select
from typing import Optional

from src.models import (
    Transaction,
    TransactionType,
    Account
)
from src.schemas import TransactionParams


def get_transaction_by_id(session: Session, transaction_id: int) -> Optional[Transaction]:
    return session.get(Transaction, transaction_id)


def get_account_transactions_by_filter(
        session: Session,
        account_id: int,
        params: TransactionParams
) -> list[Transaction]:
    """
    Get a list of transactions for a given account and params with pagination.

    Returns:
        List of transactions ordered by creation date in descending order.
    """
    statement = select(Transaction).where(Transaction.account_id == account_id)
    if params.type is not None:
        statement = statement.where(Transaction.type == params.type)
    if params.start is not None:
        statement = statement.where(Transaction.created_at >= params.start)
    if params.end is not None:
        statement = statement.where(Transaction.created_at <= params.end)

    statement = (
        statement
        .offset(params.offset)
        .limit(params.limit)
        .order_by(Transaction.created_at.desc())
    )
    return list(session.execute(statement).scalars().all())


def get_account_transactions(
        session: Session,
        account_id: int,
        offset: int,
        limit: int
) -> list[Transaction]:
    """
    Get a list of transactions for a given account with pagination.

    Returns:
        List of transactions ordered by creation date in descending order.
    """
    statement = (
        select(Transaction)
        .where(Transaction.account_id == account_id)
        .offset(offset)
        .limit(limit)
        .order_by(Transaction.created_at.desc())
    )
    return list(session.execute(statement).scalars().all())


def create_transaction(
        session: Session,
        account_id: int,
        balance_before: float,
        balance_after: float,
        description: str,
        transaction_type: TransactionType
) -> Transaction:
    """
    Create a transaction for a given account and return the transaction created.
    """
    transaction = Transaction(
        account_id=account_id,
        balance_before=balance_before,
        balance_after=balance_after,
        description=description,
        type=transaction_type
    )
    session.add(transaction)
    session.flush()
    session.refresh(transaction)
    return transaction


def handle_internal_transfer(
        session: Session,
        sender: Account,
        receiver: Account,
        amount: Decimal,
        description: str
) -> Transaction:
    """
    Handle an internal transfer between two accounts, update their accounts
    balances, create transactions for both accounts and returns the transaction
    created for the sender's account.
    """
    transaction = create_transaction(
        session, sender.id, sender.balance, sender.balance - amount, description, TransactionType.TRANSFER_OUT
    )
    sender.balance = sender.balance - amount

    # TODO: Implement currency conversion
    _ = create_transaction(
        session, receiver.id, receiver.balance, receiver.balance + amount, description,
        TransactionType.TRANSFER_IN
    )
    receiver.balance = receiver.balance + amount
    session.flush()
    return transaction


def handle_external_transfer(
        session: Session,
        sender: Account,
        amount: Decimal,
        description: str
) -> Transaction:
    """
    Handle an external transfer from an account to an external account, update
    the sender's account balance and return the transaction created for the
    sender's account.
    """
    transaction = create_transaction(
        session, sender.id, sender.balance, sender.balance - amount, description, TransactionType.TRANSFER_OUT
    )
    sender.balance = sender.balance - amount
    session.flush()
    return transaction


def handle_withdrawal(
        session: Session,
        account: Account,
        amount: Decimal
) -> Transaction:
    """
    Handle a withdrawal from an account, update the account balance and return
    the transaction created for the account.
    """
    transaction = create_transaction(
        session, account.id, account.balance, account.balance - amount,
        "Withdrawal of funds using the card", TransactionType.WITHDRAWAL
    )
    account.balance = account.balance - amount
    session.flush()
    return transaction


def handle_deposit(
        session: Session,
        account: Account,
        amount: Decimal
) -> Transaction:
    """
    Handle a deposit to an account, update the account balance and return the
    transaction created for the account.
    """
    transaction = create_transaction(
        session, account.id, account.balance, account.balance + amount,
        "Deposit of funds using the card", TransactionType.DEPOSIT
    )
    account.balance = account.balance + amount
    session.flush()
    return transaction
