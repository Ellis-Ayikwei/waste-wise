from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/service-requests/$', consumers.ServiceRequestConsumer.as_asgi()),
    re_path(r'^ws/service-requests/(?P<request_id>\w+)/$', consumers.ServiceRequestConsumer.as_asgi()),
]
