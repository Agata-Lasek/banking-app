from src.endpoints import (
    customer,
    auth,
    health,
    account,
    self,
    transaction,
    loan
)

routers = [
    health.router,
    auth.router,
    customer.router,
    self.router,
    account.router,
    transaction.router,
    loan.router
]

__all__ = [
    "routers"
]

