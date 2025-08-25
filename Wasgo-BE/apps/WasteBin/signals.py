from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import SensorReading
from .utils import create_bin_alert_from_sensor_reading


@receiver(post_save, sender=SensorReading)
def create_alerts_from_sensor_reading(sender, instance, created, **kwargs):
    """
    Automatically create alerts when a new sensor reading is created
    """
    if created:
        # Create alerts based on the sensor reading
        alerts_created = create_bin_alert_from_sensor_reading(instance)

        # Log the alerts created (optional)
        if alerts_created:
            print(
                f"Created {len(alerts_created)} alerts from sensor reading {instance.id}"
            )
