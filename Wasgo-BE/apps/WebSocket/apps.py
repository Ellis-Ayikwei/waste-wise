from django.apps import AppConfig


class WebSocketConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.WebSocket'
    
    def ready(self):
        import apps.WebSocket.signals
