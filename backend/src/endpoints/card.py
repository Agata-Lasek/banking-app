from fastapi import (
    APIRouter,
    HTTPException,
    status,
    Body
)

from src.dependencies import SessionDep, ValidCardOwnerDep
from src.schemas import Card
from src import crud

router = APIRouter(
    prefix="/cards",
    tags=["cards"],
)


@router.get(
    "/{card_id}",
    summary="Get card details",
    response_model=Card
)
def get_card_details(card: ValidCardOwnerDep) -> Card:
    return card


@router.put(
    "/{card_id}/activate",
    summary="Activate card",
    response_model=Card
)
def activate_card(
        *,
        pin: str = Body(..., min_length=4, max_length=4, embed=True),
        session: SessionDep,
        card: ValidCardOwnerDep
) -> Card:
    if card.pin is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Card is already activated"
        )
    card = crud.card.activate_card(session, card, pin)
    session.commit()
    return card


@router.put(
    "/{card_id}/block",
    summary="Block card",
    response_model=Card
)
def block_card(session: SessionDep, card: ValidCardOwnerDep) -> Card:
    if card.blocked_at is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Card is already blocked"
        )
    card = crud.card.block_card(session, card)
    session.commit()
    return card


@router.put(
    "/{card_id}/unblock",
    summary="Unblock card",
    response_model=Card
)
def unblock_card(session: SessionDep, card: ValidCardOwnerDep) -> Card:
    if card.blocked_at is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Card is not blocked"
        )
    card = crud.card.unblock_card(session, card)
    session.commit()
    return card
