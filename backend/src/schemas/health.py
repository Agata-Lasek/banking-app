from pydantic import BaseModel
from datetime import datetime, timezone


class HealthCheck(BaseModel):
    status: str = "OK"
    timestamp: datetime = datetime.now(tz=timezone.utc)
