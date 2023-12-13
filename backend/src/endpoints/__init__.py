from src.endpoints import (
    customer,
    auth,
    health,
    account,
    self
)

routers = [
    health.router,
    auth.router,
    customer.router,
    self.router,
    account.router
]

__all__ = [
    "routers"
]

