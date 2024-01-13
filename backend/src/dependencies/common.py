from typing import Annotated, Generator
from fastapi import (
    Depends,
    HTTPException,
    status
)
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from src.core import SessionLocal
from src.core.settings import settings
from src.schemas import (
    TokenPayload,
    Customer
)
from src import crud


reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_PATH}/auth/token"
)


def get_db() -> Generator:
    session = SessionLocal()
    try:
        yield session
    except SQLAlchemyError as exc:
        session.rollback()
        raise exc


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]


def get_current_customer(
        session: SessionDep,
        token: TokenDep
) -> Customer:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )

    customer = crud.customer.get_customer_by_id(session, token_data.sub)
    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return customer


CurrentCustomerDep = Annotated[Customer, Depends(get_current_customer)]
