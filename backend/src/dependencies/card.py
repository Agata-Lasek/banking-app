from fastapi import (
    Depends,
    HTTPException,
    status
)
from typing import Annotated

from src.dependencies import SessionDep, CurrentCustomerDep
from src import crud
from src.models import Card


def valid_card_owner(
        card_id: int,
        session: SessionDep,
        customer: CurrentCustomerDep,
) -> Card:
    """
    Validate that the customer owns the card and return the card object.
    """
    card = crud.card.get_card_by_id(session, card_id)
    if card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found"
        )
    allowed = any([
        account.id == card.account_id
        for account in customer.accounts
    ])
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You're not allowed to access this card"
        )
    return card


ValidCardOwnerDep = Annotated[Card, Depends(valid_card_owner)]


def active_card(card: ValidCardOwnerDep) -> Card:
    if card.pin is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You need to activate the card first"
        )
    return card


ActiveCardDep = Annotated[Card, Depends(active_card)]
