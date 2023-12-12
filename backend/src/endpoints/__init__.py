from src.endpoints import (
    customer,
    auth,
    health
)

routers = [
    health.router,
    auth.router,
    customer.router
]

__all__ = [
    "routers"
]

