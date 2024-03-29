from fastapi import APIRouter, status

from src.schemas import HealthCheck

router = APIRouter(
    tags=["healthcheck"],
)


@router.get(
    "/healthcheck",
    summary="Perform a Health Check",
    response_description="Return HTTP Status Code 200 (OK)",
    status_code=status.HTTP_200_OK,
    response_model=HealthCheck
)
def get_health() -> HealthCheck:
    return HealthCheck()
