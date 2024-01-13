from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from src.schemas import Token
from src.dependencies import SessionDep
from src.core import settings, security
from src import crud

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post(
    "/token",
    description="OAuth2 compatible token login, get an access token for future requests.",
    response_model=Token
)
def get_access_token(
    session: SessionDep,
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Token:
    customer = crud.customer.authenticate_customer(
        session=session,
        email=form_data.username,
        password=form_data.password
    )
    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = security.create_access_token(
        customer.id,
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRY)
    )
    return Token(access_token=access_token, token_type="Bearer")
