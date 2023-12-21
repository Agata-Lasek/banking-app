from src.endpoints import (
    customer,
    auth,
    health,
    account,
    self,
    loan,
    card
)

routers = [
    health.router,
    auth.router,
    customer.router,
    self.router,
    account.router,
    loan.router,
    card.router
]

__all__ = [
    "routers"
]
