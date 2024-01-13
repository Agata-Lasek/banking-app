from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from pydantic_extra_types.phone_numbers import PhoneNumber

PhoneNumber.phone_format = "E164"


class CustomerBase(BaseModel):
    name: str
    surname: str
    email: EmailStr
    phone: PhoneNumber


class CustomerCreate(CustomerBase):
    password: str

    @field_validator("password", mode="after")
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase character")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase character")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class CustomerUpdate(BaseModel):
    surname: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[PhoneNumber] = None


class CustomerInDB(CustomerBase):
    id: int

    class ConfigDict:
        from_attributes = True


class Customer(CustomerInDB):
    ...
