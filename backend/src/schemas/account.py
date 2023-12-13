from pydantic import (
    BaseModel,
    model_validator,
    Field
)

from src.models import AccountType, Currency


class AccountBase(BaseModel):
    currency: Currency
    type: AccountType

    class ConfigDict:
        use_enum_values = True


class AccountCreate(AccountBase):
    currency: Currency = Currency.PLN
    type: AccountType = AccountType.CHECKING

    @model_validator(mode="after")
    def verify_account_type_and_currency(self) -> "AccountBase":
        if (
                self.type in [AccountType.CHECKING, AccountType.SAVING]
                and self.currency != Currency.PLN
        ):
            raise ValueError("Checking or saving account can only be in PLN")
        if self.type == AccountType.FOREIGN_CURRENCY and self.currency == Currency.PLN:
            raise ValueError("Foreign currency account must be in foreign currency")
        return self


class AccountInDB(AccountBase):
    id: int
    customer_id: int = Field(..., serialization_alias="customerId")
    number: str
    balance: float

    class ConfigDict:
        from_attributes = True


class Account(AccountInDB):
    ...
