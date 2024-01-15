from sqlalchemy.orm import Session
from decimal import Decimal
from sqlalchemy.sql.expression import select
from typing import Optional
import requests
from requests.exceptions import HTTPError
from enum import Enum

from src.models import (
    Transaction,
    TransactionType,
    Account,
    Currency
)


def get_transaction_by_id(session: Session, transaction_id: int) -> Optional[Transaction]:
    return session.get(Transaction, transaction_id)


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
    return transaction

    
def get_exchange_rate(currency):
    try:
        url = f'http://api.nbp.pl/api/' \
              f'exchangerates/rates/a/' \
              f'{currency}/' \
              f'?format=json'
        response = requests.get(url)
    except HTTPError as http_error:
        print(f'HTTP error: {http_error}')
        return None 
    except Exception as e:
        print(f'Other exception: {e}')
        return None  # Zwracamy None w przypadku ogólnego błędu
    else:
        if response.status_code == 200:
            # Zwracamy wartość kursu waluty
            return response.json()['rates'][0]['mid']
        else:
            print(f'Error: {response.status_code}')
            return None 
        

def handle_internal_transfer(
        session: Session,
        sender: Account,
        receiver: Account,
        amount: float,
        description: str
) -> Transaction:
    """
    Handle an internal transfer between two accounts, update their accounts
    balances, create transactions for both accounts and returns the transaction
    created for the sender's account.
    """
    transaction = create_transaction(
        session, sender.id, sender.balance, sender.balance - Decimal(amount), description, TransactionType.TRANSFER_OUT
    )
    sender.balance = sender.balance - Decimal(amount)
    
    
    # TODO: Implement currency conversion
    if sender.currency == Currency.PLN:
        if receiver.currency != Currency.PLN:
            exchange_rate = get_exchange_rate(receiver.currency)
            amount = Decimal(amount) / exchange_rate
        else:
            amount = Decimal(amount)
            
    elif sender.currency != Currency.PLN:
        if receiver.currency == Currency.PLN:
            exchange_rate2 = get_exchange_rate(sender.currency)
            amount = Decimal(amount) * exchange_rate2
        elif receiver.currency != Currency.PLN:
            exchange_rate2 = get_exchange_rate(sender.currency)
            amount = Decimal(amount) * exchange_rate2
            exchange_rate = get_exchange_rate(receiver.currency)
            amount = Decimal(amount) / exchange_rate
            
    

        
            
    

    # TODO: Implement currency conversion
    
    
    
    _ = create_transaction(
        session, receiver.id, receiver.balance, receiver.balance + Decimal(amount), description,
        TransactionType.TRANSFER_IN
    )
    receiver.balance = receiver.balance + Decimal(amount)
    return transaction


def handle_external_transfer(
        session: Session,
        sender: Account,
        amount: float,
        description: str
) -> Transaction:
    """
    Handle an external transfer from an account to an external account, update
    the sender's account balance and return the transaction created for the
    sender's account.
    """
    transaction = create_transaction(
        session, sender.id, sender.balance, sender.balance - Decimal(amount), description, TransactionType.TRANSFER_OUT
    )
    sender.balance = sender.balance - Decimal(amount)
    return transaction
