from django.apps import AppConfig


class ServicerequestConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.ServiceRequest"
    verbose_name = "Service ServiceRequest Management"

    def ready(self):
        """Import signals when the app is ready"""
        try:
            import apps.ServiceRequest.signals
        except ImportError:
            pass
