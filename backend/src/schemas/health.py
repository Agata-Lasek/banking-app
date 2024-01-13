from pydantic import BaseModel
from datetime import datetime, timezone

from src import __version__


class HealthCheck(BaseModel):
    status: str = "OK"
    timestamp: datetime = datetime.now(tz=timezone.utc)
    version: str = f"v{__version__}"
