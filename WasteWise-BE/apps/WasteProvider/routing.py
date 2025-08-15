from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/tracking/(?P<request_id>\w+)/$', consumers.TrackingConsumer.as_asgi()),
    re_path(r'ws/provider/jobs/$', consumers.ProviderJobConsumer.as_asgi()),
]