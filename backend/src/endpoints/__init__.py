from src.endpoints import (
    customer,
    auth,
    health,
    account,
    self,
    loan
)

routers = [
    health.router,
    auth.router,
    customer.router,
    self.router,
    account.router,
    loan.router
]

__all__ = [
    "routers"
]

