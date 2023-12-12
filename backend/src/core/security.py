from datetime import (
    datetime,
    timezone,
    timedelta
)
from jose import jwt
from typing import Any, Optional
from passlib.context import CryptContext

from src.core.settings import settings

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def create_access_token(
        subject: str | Any,
        expires_delta: Optional[timedelta] = None
) -> str:
    expire = datetime.now(timezone.utc)
    expire += expires_delta if expires_delta is not None \
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRY)

    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
