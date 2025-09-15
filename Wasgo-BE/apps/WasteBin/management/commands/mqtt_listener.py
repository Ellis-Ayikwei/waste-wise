import os
import sys
import time

import signal
import logging
import json
import django
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
import paho.mqtt.client as mqtt
from apps.WasteBin.models import SmartBin, Sensor, SensorReading, build_bin_status_data
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# Django is already configured when running as management command


LOG = logging.getLogger("mqtt-listener")
LOG.setLevel(logging.INFO)

# MQTT_HOST = os.getenv("MQTT_HOST", "broker.hivemq.com")
MQTT_HOST = os.getenv("MQTT_HOST", "mqtt-dashboard.com")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
MQTT_KEEPALIVE = int(os.getenv("MQTT_KEEPALIVE", "60"))
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "wasgo/sensors/readings")
# MQTT_TOPIC = os.getenv("MQTT_TOPIC", "axioiii/gps/out")

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
        # print(f"the data is {data}")

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
        # For testing, use the first available sensor and bin
        try:
            sensor = Sensor.objects.first()
            if not sensor:
                print(f"\033[93m[MQTT] No sensors found in database\033[0m", flush=True)
                return
            print(
                f"\033[92m[MQTT] Using sensor: {sensor.id}\033[0m",
                flush=True,
            )
        except Exception as e:
            print(f"\033[93m[MQTT] Error getting sensor: {e}\033[0m", flush=True)
            return

        try:
            # Try to find bin by bin_number first, then by ID
            bin_obj = SmartBin.objects.filter(id=bin_id).first()
            if not bin_obj:
                bin_obj = SmartBin.objects.first()
                print(
                    f"\033[92m[MQTT] Using bin: {bin_obj.id} ({bin_obj.name}) - Number: {bin_obj.bin_number}\033[0m",
                    flush=True,
                )
            if not bin_obj:
                print(f"\033[93m[MQTT] No bins found in database\033[0m", flush=True)
                return
            print(
                f"\033[92m[MQTT] Using bin: {bin_obj.id} ({bin_obj.name}) - Number: {bin_obj.bin_number}\033[0m",
                flush=True,
            )
        except Exception as e:
            print(f"\033[93m[MQTT] Error getting bin: {e}\033[0m", flush=True)
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

            # Save the bin updates
            bin_obj.save()

            # Update sensor status
            sensor.battery_level = data.get("battery_level", 100)
            sensor.signal_strength = data.get("signal_strength", 100)
            sensor.save()

            # Send WebSocket update directly via Channels (Redis-backed)
            try:
                channel_layer = get_channel_layer()

                bin_type_name = None
                if bin_obj.bin_type:
                    try:
                        bin_type_name = str(bin_obj.bin_type.name)
                    except (AttributeError, TypeError):
                        bin_type_name = None

                bin_data = build_bin_status_data(bin_obj, bin_type_name)

                # Send to bin owner group if assigned
                if bin_obj.user:
                    async_to_sync(channel_layer.group_send)(
                        f"user_{bin_obj.user.id}",
                        {"type": "bin_status_update", "data": bin_data},
                    )

                # Always send to admin groups
                async_to_sync(channel_layer.group_send)(
                    "admin_dashboard",
                    {"type": "bin_status_update", "data": bin_data},
                )
                async_to_sync(channel_layer.group_send)(
                    "admin_notifications",
                    {"type": "bin_status_update", "data": bin_data},
                )

                # Optional alert push when very full
                try:
                    if int(bin_obj.fill_level) >= 90 and bin_obj.user:
                        async_to_sync(channel_layer.group_send)(
                            f"user_{bin_obj.user.id}",
                            {
                                "type": "sensor_alert",
                                "data": {
                                    "bin_id": str(bin_obj.id),
                                    "bin_number": str(bin_obj.bin_number),
                                    "bin_name": str(bin_obj.name),
                                    "alert_type": "full",
                                    "fill_level": int(bin_obj.fill_level),
                                    "message": f"🚨 URGENT: Bin {bin_obj.bin_number} is {bin_obj.fill_level}% full and needs immediate collection!",
                                    "priority": "high",
                                    "location": str(bin_obj.address),
                                    "timestamp": bin_obj.updated_at.isoformat(),
                                },
                            },
                        )
                except Exception:
                    pass

            except Exception as e:
                LOG.error(f"Error sending WebSocket update via Channels: {e}")

            print(
                f"\033[96m[MQTT] ✅ Updated {bin_obj.name} ({bin_obj.bin_number}) - Fill: {fill_level}%, Weight: {data.get('weight_kg', 0)}kg, Temp: {data.get('temperature', 'N/A')}°C\033[0m",
                flush=True,
            )

        # WebSocket update sent directly via model method

    except json.JSONDecodeError:
        print(f"\033[91m[MQTT] Invalid JSON payload: {payload}\033[0m", flush=True)
    except Exception as e:
        print(f"\033[91m[MQTT] Error processing sensor reading: {e}\033[0m", flush=True)


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
            global _should_stop
            LOG.info("Stopping MQTT listener...")
            _should_stop = True
            try:
                # Properly shutdown MQTT connection
                try:
                    client.loop_stop()
                    client.disconnect()
                    LOG.info("MQTT connection closed")
                except Exception as e:
                    LOG.warning(f"Error closing MQTT connection: {e}")
            except Exception as e:
                LOG.error(f"Error during MQTT shutdown: {e}")
            finally:
                LOG.info("MQTT listener shutdown complete")
                # Force exit immediately
                import os

                os._exit(0)

        # Setup signal handlers
        signal.signal(signal.SIGINT, handle_sig)
        signal.signal(signal.SIGTERM, handle_sig)

        client = build_client()
        backoff = 1

        try:
            LOG.info(f"Connecting to MQTT broker: {MQTT_HOST}:{MQTT_PORT}")

            # Connect with retry logic
            max_retries = 5
            retry_count = 0
            connected = False

            while retry_count < max_retries and not connected and not _should_stop:
                try:
                    result = client.connect(
                        MQTT_HOST, MQTT_PORT, keepalive=MQTT_KEEPALIVE
                    )
                    if result == 0:
                        connected = True
                        LOG.info("MQTT connected successfully")
                        client.loop_start()
                    else:
                        LOG.warning(f"MQTT connection failed with code: {result}")
                        retry_count += 1
                        if retry_count < max_retries:
                            LOG.info(
                                f"Retrying connection in 5 seconds... ({retry_count}/{max_retries})"
                            )
                            time.sleep(5)
                except Exception as e:
                    LOG.error(f"Connection attempt {retry_count + 1} failed: {e}")
                    retry_count += 1
                    if retry_count < max_retries:
                        time.sleep(5)

            if not connected:
                LOG.error("Failed to connect to MQTT broker after all retries")
                return

            LOG.info("MQTT listener started. Press Ctrl+C to stop.")
            while not _should_stop:
                time.sleep(0.5)

        except Exception as e:
            LOG.error(f"Connect error: {e}")
        finally:
            try:
                # Complete shutdown sequence
                LOG.info("Initiating complete MQTT shutdown...")
                if client.is_connected():
                    client.loop_stop()
                    client.disconnect()
                    LOG.info("MQTT connection terminated")
                else:
                    LOG.info("MQTT connection already terminated")

                # Force cleanup
                client = None
                LOG.info("MQTT client cleaned up")

            except Exception as e:
                LOG.error(f"Error during final cleanup: {e}")
            finally:
                LOG.info("MQTT listener completely stopped.")
