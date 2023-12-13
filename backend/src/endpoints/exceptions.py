from fastapi import HTTPException, status
from typing import Optional


class HTTP403Exception(HTTPException):
    def __init__(self, detail: Optional[str] = None):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail or "You don't have permission to perform this action"
        )


class HTTP404Exception(HTTPException):
    def __init__(self, detail: Optional[str] = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail or "Resource for the specified ID was not found"
        )
