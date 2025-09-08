from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # General WebSocket endpoint for customers
    re_path(r"^ws/$", consumers.GeneralWebSocketConsumer.as_asgi()),
    # Admin WebSocket endpoint
    re_path(r"^ws/admin/$", consumers.AdminWebSocketConsumer.as_asgi()),
]
