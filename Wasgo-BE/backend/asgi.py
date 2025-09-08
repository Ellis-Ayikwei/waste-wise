import os

# Configure Django settings BEFORE importing any Django modules
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# Initialize Django
django_asgi_app = get_asgi_application()

# Now import WebSocket routing after Django is initialized
from apps.WebSocket.routing import websocket_urlpatterns as websocket_ws_patterns

# Combine all WebSocket patterns
all_websocket_patterns = (
    websocket_ws_patterns  # General WebSocket endpoints (must be first for /ws/ and /ws/admin/)
    # + servicerequest_ws_patterns  # Temporarily disabled
    # + tracking_ws_patterns  # Temporarily disabled
    # + chat_ws_patterns  # Temporarily disabled
    # + wastebin_ws_patterns  # Temporarily disabled
    # + wasteprovider_ws_patterns  # Removed - merged into Provider app
)

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AuthMiddlewareStack(URLRouter(all_websocket_patterns)),
    }
)
