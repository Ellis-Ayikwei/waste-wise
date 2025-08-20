from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/smart-bins/$", consumers.SmartBinConsumer.as_asgi()),
    re_path(r"ws/smart-bins/(?P<bin_id>\w+)/$", consumers.SmartBinConsumer.as_asgi()),
    re_path(r"ws/dashboard/$", consumers.DashboardConsumer.as_asgi()),
    re_path(r"ws/dashboard/(?P<user_id>\w+)/$", consumers.DashboardConsumer.as_asgi()),
]
