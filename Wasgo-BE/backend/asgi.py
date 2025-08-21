import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from apps.Tracking.routing import websocket_urlpatterns as tracking_ws_patterns
from apps.Chat.routing import websocket_urlpatterns as chat_ws_patterns
from apps.WasteBin.routing import websocket_urlpatterns as wastebin_ws_patterns

# from apps.WasteProvider.routing import (
#     websocket_urlpatterns as wasteprovider_ws_patterns,
# )  # Removed - merged into Provider app

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# Combine all WebSocket patterns
all_websocket_patterns = (
    tracking_ws_patterns
    + chat_ws_patterns
    + wastebin_ws_patterns
    # + wasteprovider_ws_patterns  # Removed - merged into Provider app
)

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(URLRouter(all_websocket_patterns)),
    }
)
