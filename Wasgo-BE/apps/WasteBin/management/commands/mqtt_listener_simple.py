import os
import time
import logging
import json
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
import paho.mqtt.client as mqtt
from apps.WasteBin.models import SmartBin, Sensor, SensorReading

LOG = logging.getLogger("mqtt-listener")
LOG.setLevel(logging.INFO)

# MQTT Configuration
MQTT_HOST = os.getenv("MQTT_HOST", "test.mosquitto.org")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
MQTT_KEEPALIVE = int(os.getenv("MQTT_KEEPALIVE", "60"))
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "wasgo/sensors/readings")


def on_connect(client, userdata, flags, rc, properties=None, *args):
    if rc == 0:
        LOG.info(f"Connected to MQTT {MQTT_HOST}:{MQTT_PORT}")
        client.subscribe(MQTT_TOPIC, qos=0)
        LOG.info(f"Subscribed to topic: {MQTT_TOPIC}")
    else:
        LOG.error(f"Failed to connect to MQTT broker: {rc}")


def on_disconnect(client, userdata, rc, properties=None, *args):
    LOG.warning(f"MQTT disconnected: {rc}")


def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode("utf-8")
        LOG.info(f"Received message on {msg.topic}: {payload}")

        data = json.loads(payload)
        process_sensor_reading(data)

    except json.JSONDecodeError:
        LOG.error(f"Invalid JSON payload: {payload}")
    except Exception as e:
        LOG.error(f"Error processing message: {e}")


def process_sensor_reading(data):
    """Process incoming sensor reading and update database"""
    try:
        with transaction.atomic():
            # Get or create sensor
            sensor, created = Sensor.objects.get_or_create(
                sensor_id=data.get("sensor_id", "sensor_001"),
                defaults={
                    "name": f"Sensor {data.get('sensor_id', 'sensor_001')}",
                    "sensor_type": "smart_bin",
                    "is_active": True,
                },
            )

            # Get bin (use first available for testing)
            bin_id = data.get("bin_id", "bin_001")
            bin_obj = SmartBin.objects.filter(bin_number=bin_id).first()
            if not bin_obj:
                bin_obj = SmartBin.objects.first()
                if not bin_obj:
                    LOG.error("No bins found in database")
                    return

            # Extract sensor data
            fill_level = float(data.get("fill_level", 0))
            weight_kg = float(data.get("weight_kg", 0))
            temperature = data.get("temperature")
            humidity = data.get("humidity")
            distance_cm = data.get("distance_cm")
            lat = data.get("lat")
            lon = data.get("lon")
            battery_level = data.get("battery_level", 100)
            signal_strength = data.get("signal_strength", 100)

            # Update bin with sensor data
            bin_obj.fill_level = fill_level
            bin_obj.current_weight_kg = weight_kg
            bin_obj.temperature = temperature
            bin_obj.humidity = humidity
            bin_obj.last_reading_at = timezone.now()
            bin_obj.is_online = True

            # Update fill status based on level
            if fill_level <= 20:
                bin_obj.fill_status = "empty"
            elif fill_level <= 40:
                bin_obj.fill_status = "low"
            elif fill_level <= 60:
                bin_obj.fill_status = "medium"
            elif fill_level <= 80:
                bin_obj.fill_status = "high"
            elif fill_level <= 100:
                bin_obj.fill_status = "full"
            else:
                bin_obj.fill_status = "overflow"

            # Update bin status if needed
            if fill_level >= 80:
                bin_obj.status = "full"
            elif bin_obj.status == "full" and fill_level < 80:
                bin_obj.status = "active"

            # Save the bin updates
            bin_obj.save()

            # Update sensor status
            sensor.battery_level = battery_level
            sensor.signal_strength = signal_strength
            sensor.save()

            # Send WebSocket update directly
            bin_obj.send_websocket_update()

            LOG.info(
                f"✅ Updated {bin_obj.name} ({bin_obj.bin_number}) - Fill: {fill_level}%, Weight: {weight_kg}kg, Temp: {temperature}°C"
            )

    except Exception as e:
        LOG.error(f"Error processing sensor reading: {e}")


class Command(BaseCommand):
    help = "MQTT listener for sensor data"

    def handle(self, *args, **options):
        """Run MQTT listener in background thread"""
        client = mqtt.Client()
        client.on_connect = on_connect
        client.on_message = on_message
        client.on_disconnect = on_disconnect

        try:
            LOG.info(f"Connecting to MQTT broker: {MQTT_HOST}:{MQTT_PORT}")
            client.connect(MQTT_HOST, MQTT_PORT, MQTT_KEEPALIVE)
            client.loop_start()

            # Keep the thread alive
            while True:
                time.sleep(1)

        except Exception as e:
            LOG.error(f"MQTT listener error: {e}")
        finally:
            try:
                client.loop_stop()
                client.disconnect()
                LOG.info("MQTT listener shutdown complete")
            except Exception as e:
                LOG.warning(f"Error during final cleanup: {e}")
