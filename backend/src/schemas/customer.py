from pydantic import BaseModel, EmailStr
from typing import Optional


class CustomerBase(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class CustomerCreate(CustomerBase):
    name: str
    surname: str
    email: EmailStr
    phone: str
    password: str


class CustomerUpdate(CustomerBase):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class CustomerInDBBase(CustomerBase):
    id: Optional[int] = None

    class ConfigDict:
        from_attributes = True


class Customer(CustomerInDBBase):
    ...


class CustomerInDB(CustomerInDBBase):
    password: Optional[str] = None
