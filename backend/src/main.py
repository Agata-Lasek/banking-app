from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

from src.core.settings import settings
from src.endpoints import routers
from src import __version__


app = FastAPI(
    title="banking-app",
    version=__version__,
    openapi_url=f"{settings.API_PATH}/openapi.json",
    description="A simple banking app that offers end users possibility to create multiple bank accounts with "
                "multiple cards assigned to them, make internal and external transfers, and take out a loan."
)

if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=[str(method) for method in settings.CORS_METHODS],
        allow_headers=["*"]
    )

router = APIRouter(prefix=settings.API_PATH)
for rtr in routers:
    router.include_router(rtr)
app.include_router(router)
