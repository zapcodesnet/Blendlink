"""Rate limiting middleware for BlendLink API"""
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os

# Configure rate limiter
REDIS_URL = os.environ.get("REDIS_URL", None)

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200/minute"],
    storage_uri=REDIS_URL if REDIS_URL else "memory://",
)

# Rate limit decorators for different endpoint types
AUTH_LIMIT = "10/minute"          # Login/register
GAMBLING_LIMIT = "30/minute"      # Games/bets
FINANCIAL_LIMIT = "5/minute"      # Withdrawals/payments
UPLOAD_LIMIT = "10/minute"        # File uploads
GENERAL_LIMIT = "60/minute"       # General API calls
