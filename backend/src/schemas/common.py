from pydantic.generics import GenericModel
from pydantic import BaseModel
from typing import Generic, TypeVar

M = TypeVar("M", bound=BaseModel)


class GenericMultipleItems(GenericModel, Generic[M]):
    items: list[M]
