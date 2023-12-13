from pydantic import BaseModel, EmailStr
from typing import Optional


class CustomerBase(BaseModel):
    name: str
    surname: str
    email: EmailStr
    phone: str


class CustomerCreate(CustomerBase):
    password: str


class CustomerUpdate(BaseModel):
    surname: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class CustomerInDB(CustomerBase):
    id: int

    class ConfigDict:
        from_attributes = True


class Customer(CustomerInDB):
    ...
