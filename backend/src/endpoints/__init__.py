from src.endpoints import (
    customer,
    auth,
    health,
    account,
    self,
    transaction
)

routers = [
    health.router,
    auth.router,
    customer.router,
    self.router,
    account.router,
    transaction.router
]

__all__ = [
    "routers"
]

