import os
import time
import signal
import logging
import json
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
import paho.mqtt.client as mqtt
from apps.WasteBin.models import SmartBin, Sensor, SensorReading


LOG = logging.getLogger("mqtt-listener")
LOG.setLevel(logging.INFO)

MQTT_HOST = os.getenv("MQTT_HOST", "broker.hivemq.com")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
MQTT_KEEPALIVE = int(os.getenv("MQTT_KEEPALIVE", "60"))
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "wasgo/sensors/readings")

_should_stop = False


def on_connect(client, userdata, flags, rc, properties=None, *args):
    if rc == 0:
        LOG.info(f"Connected to MQTT {MQTT_HOST}:{MQTT_PORT}")
        client.subscribe(MQTT_TOPIC, qos=0)
        LOG.info(f"Subscribed to topic: {MQTT_TOPIC}")
    else:
        LOG.error(f"Connect failed rc={rc}")


def on_disconnect(client, userdata, rc, properties=None, *args):
    LOG.warning(f"Disconnected rc={rc}")


def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode("utf-8", errors="replace")
        print(
            f"\033[92m[MQTT] Topic: {msg.topic} | Message: {payload}\033[0m", flush=True
        )

        # Process the sensor reading
        process_sensor_reading(msg.topic, payload)

    except Exception as e:
        payload = str(msg.payload)
        print(
            f"\033[91m[MQTT] Error processing message: {e} | Raw: {payload}\033[0m",
            flush=True,
        )


def process_sensor_reading(topic, payload):
    """Process incoming sensor reading and update database"""
    try:
        # Parse JSON payload
        data = json.loads(payload)

        # Extract sensor information
        sensor_id = data.get("sensor_id")
        bin_id = data.get("bin_id")

        if not sensor_id or not bin_id:
            print(
                f"\033[93m[MQTT] Missing sensor_id or bin_id in message\033[0m",
                flush=True,
            )
            return

        # Find the sensor and bin
        try:
            sensor = Sensor.objects.get(sensor_number=sensor_id)
            bin_obj = SmartBin.objects.get(bin_number=bin_id)
        except Sensor.DoesNotExist:
            print(
                f"\033[93m[MQTT] Sensor {sensor_id} not found in database\033[0m",
                flush=True,
            )
            return
        except SmartBin.DoesNotExist:
            print(
                f"\033[93m[MQTT] Bin {bin_id} not found in database\033[0m", flush=True
            )
            return

        # Create sensor reading
        with transaction.atomic():
            reading = SensorReading.objects.create(
                bin=bin_obj,
                sensor=sensor,
                timestamp=timezone.now(),
                fill_level=data.get("fill_level", 0),
                weight_kg=data.get("weight_kg"),
                temperature=data.get("temperature"),
                humidity=data.get("humidity"),
                battery_level=data.get("battery_level", 100),
                signal_strength=data.get("signal_strength", 100),
                motion_detected=data.get("motion_detected", False),
                lid_open=data.get("lid_open", False),
                error_code=data.get("error_code", ""),
                raw_data=data,
            )

            # Update bin with latest sensor data
            bin_obj.fill_level = data.get("fill_level", 0)
            bin_obj.temperature = data.get("temperature")
            bin_obj.humidity = data.get("humidity")
            bin_obj.current_weight_kg = data.get("weight_kg", 0)
            bin_obj.last_reading_at = timezone.now()

            # Update fill status based on fill level
            fill_level = data.get("fill_level", 0)
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

            bin_obj.save()

            # Update sensor status
            sensor.battery_level = data.get("battery_level", 100)
            sensor.signal_strength = data.get("signal_strength", 100)
            sensor.save()

            print(
                f"\033[96m[MQTT] ✅ Updated {bin_obj.name} ({bin_obj.bin_number}) - Fill: {fill_level}%, Weight: {data.get('weight_kg', 0)}kg, Temp: {data.get('temperature', 'N/A')}°C\033[0m",
                flush=True,
            )

            # Broadcast update via WebSocket
            broadcast_sensor_update(bin_obj, reading)

    except json.JSONDecodeError:
        print(f"\033[91m[MQTT] Invalid JSON payload: {payload}\033[0m", flush=True)
    except Exception as e:
        print(f"\033[91m[MQTT] Error processing sensor reading: {e}\033[0m", flush=True)


def broadcast_sensor_update(bin_obj, reading):
    """Broadcast sensor update via WebSocket"""
    try:
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync

        channel_layer = get_channel_layer()
        if not channel_layer:
            return

        # Prepare update data
        update_data = {
            "type": "sensor_update",
            "data": {
                "bin_id": str(bin_obj.id),
                "bin_number": bin_obj.bin_number,
                "bin_name": bin_obj.name,
                "fill_level": reading.fill_level,
                "fill_status": bin_obj.fill_status,
                "weight_kg": reading.weight_kg,
                "temperature": reading.temperature,
                "humidity": reading.humidity,
                "battery_level": reading.battery_level,
                "signal_strength": reading.signal_strength,
                "is_online": bin_obj.current_online_status,
                "status": bin_obj.status,
                "last_reading_at": reading.timestamp.isoformat(),
                "location": {
                    "lat": bin_obj.location.y,
                    "lng": bin_obj.location.x,
                    "address": bin_obj.address,
                },
            },
            "timestamp": reading.timestamp.isoformat(),
        }

        # Send to admin groups
        async_to_sync(channel_layer.group_send)("admin_dashboard", update_data)
        async_to_sync(channel_layer.group_send)("admin_notifications", update_data)

        # Send to bin owner if exists
        if bin_obj.user:
            async_to_sync(channel_layer.group_send)(
                f"user_{bin_obj.user.id}", update_data
            )

        print(
            f"\033[94m[MQTT] 📡 Broadcasted sensor update for {bin_obj.bin_number}\033[0m",
            flush=True,
        )

    except Exception as e:
        print(f"\033[91m[MQTT] Error broadcasting update: {e}\033[0m", flush=True)


def build_client():
    client = mqtt.Client(
        mqtt.CallbackAPIVersion.VERSION2,
        client_id=os.getenv("MQTT_CLIENT_ID", "wasgo-mqtt-listener"),
    )
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.on_message = on_message
    return client


class Command(BaseCommand):
    help = "Simple MQTT listener (no auth) that prints incoming messages"

    def handle(self, *args, **options):
        global _should_stop

        def handle_sig(signum, frame):
            nonlocal client
            LOG.info("Stopping MQTT listener...")
            _should_stop = True
            try:
                client.disconnect()
            except Exception:
                pass

        signal.signal(signal.SIGINT, handle_sig)
        signal.signal(signal.SIGTERM, handle_sig)

        client = build_client()
        backoff = 1

        try:
            LOG.info(f"Connecting to MQTT broker: {MQTT_HOST}:{MQTT_PORT}")
            client.connect(MQTT_HOST, MQTT_PORT, keepalive=MQTT_KEEPALIVE)
            client.loop_start()

            LOG.info("MQTT listener started. Press Ctrl+C to stop.")
            while not _should_stop:
                time.sleep(0.5)

        except Exception as e:
            LOG.error(f"Connect error: {e}")
        finally:
            try:
                client.loop_stop()
                client.disconnect()
            except Exception:
                pass
            LOG.info("MQTT listener stopped.")
