from pydantic_settings import BaseSettings
from pydantic import (
    AnyHttpUrl,
    PostgresDsn,
    field_validator,
    ValidationInfo
)
from typing import Optional, Union
from secrets import token_urlsafe


class Settings(BaseSettings):
    API_PATH: str = "/api/v1"
    SECRET_KEY: str = token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRY: int = 24 * 60  # minutes

    CORS_ORIGINS: list[AnyHttpUrl] = []
    CORS_METHODS: list[str] = []

    @field_validator("CORS_METHODS", mode="before")
    def prepare_cors_methods(cls, v: str):
        if isinstance(v, str) and not v.startswith("["):
            return [m.strip() for m in v.split(",")]
        if isinstance(v, (list, str)):
            return v
        return ValueError(v)

    @field_validator("CORS_ORIGINS", mode="before")
    def prepare_cors_origins(cls, v: Union[str, list[str]]) -> Union[str, list[AnyHttpUrl]]:
        if isinstance(v, str) and not v.startswith("["):
            return [c.strip() for c in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    SQLALCHEMY_POSTGRES_URI: Optional[PostgresDsn] = None

    @field_validator("SQLALCHEMY_POSTGRES_URI", mode="before")
    def prepare_postgres_uri(cls, v: Optional[str], info: ValidationInfo) -> Union[str, PostgresDsn]:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql+psycopg2",
            host=info.data.get("POSTGRES_SERVER"),
            username=info.data.get("POSTGRES_USER"),
            password=info.data.get("POSTGRES_PASSWORD"),
            path=f"{info.data.get('POSTGRES_DB') or ''}"
        )


settings = Settings()
