from sqlalchemy.orm import Session
from sqlalchemy import func, Select
from decimal import Decimal
from sqlalchemy.sql.expression import select
from typing import Optional
from datetime import (
    datetime,
    timezone,
    timedelta
)

from src.models import (
    Transaction,
    TransactionType,
    Account
)
from src.schemas import TransactionParams


def get_transaction_by_id(session: Session, transaction_id: int) -> Optional[Transaction]:
    return session.get(Transaction, transaction_id)


TRANSACTIONS_TYPES = {
    "deposit": TransactionType.DEPOSIT,
    "withdrawal": TransactionType.WITHDRAWAL,
    "transferin": TransactionType.TRANSFER_IN,
    "transferout": TransactionType.TRANSFER_OUT,
    "loantake": TransactionType.LOAN_TAKE,
    "loanpayoff": TransactionType.LOAN_PAYOFF
}


def get_filtered_transactions(
        session: Session,
        statement: Select,
        params: TransactionParams
) -> list[Transaction]:
    """
    Get a list of transactions for init statement.

    Returns:
        List of transactions ordered by creation date in descending order.
    """
    if params.type is not None:
        statement = statement.where(Transaction.type == TRANSACTIONS_TYPES[params.type])
    if params.start_date is not None:
        statement = statement.where(Transaction.created_at >= params.start_date)
    if params.end_date is not None:
        statement = statement.where(Transaction.created_at <= params.end_date)

    statement = (
        statement
        .offset(params.offset)
        .limit(params.limit)
        .order_by(Transaction.created_at.desc())
    )
    return list(session.execute(statement).scalars().all())


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
    return get_filtered_transactions(session, statement, params)


def get_customer_transactions_by_filter(
        session: Session,
        customer_id: int,
        params: TransactionParams
) -> list[Transaction]:
    """
    Get a list of transactions for a given customer and params with pagination.

    Returns:
        List of transactions ordered by creation date in descending order.
    """
    statement = (
        select(Transaction)
        .join(Account)
        .where(Account.customer_id == customer_id)
    )
    return get_filtered_transactions(session, statement, params)


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


def get_transactions_sum_within_24_hours(
        session: Session,
        account_id: int,
        transaction_type: TransactionType
) -> Decimal:
    """
    Get the sum of transactions of a given type for a given account within the last 24 hours.
    """
    today = datetime.now(tz=timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    statement = (
        select(func.coalesce(func.sum(Transaction.balance_after - Transaction.balance_before), 0))
        .where(Transaction.account_id == account_id)
        .where(Transaction.created_at >= today)
        .where(Transaction.created_at <= today + timedelta(days=1))
        .where(Transaction.type == transaction_type)
    )
    return session.execute(statement).scalar_one()
