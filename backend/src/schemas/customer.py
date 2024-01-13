from pydantic import BaseModel, EmailStr
from typing import Optional
from pydantic_extra_types.phone_numbers import PhoneNumber

PhoneNumber.phone_format = 'E164'


class CustomerBase(BaseModel):
    name: str
    surname: str
    email: EmailStr
    phone: PhoneNumber


class CustomerCreate(CustomerBase):
    password: str


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
