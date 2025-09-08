import os
import time
import signal
import logging
from django.core.management.base import BaseCommand
import paho.mqtt.client as mqtt


LOG = logging.getLogger("mqtt-listener")
LOG.setLevel(logging.INFO)

MQTT_HOST = os.getenv("MQTT_HOST", "mqtt-dashboard.com")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
MQTT_KEEPALIVE = int(os.getenv("MQTT_KEEPALIVE", "60"))
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "axioiii/gps/out")  # default to your topic

_should_stop = False


def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        LOG.info(f"Connected to MQTT {MQTT_HOST}:{MQTT_PORT}")
        client.subscribe(MQTT_TOPIC, qos=0)
        LOG.info(f"Subscribed to topic: {MQTT_TOPIC}")
    else:
        LOG.error(f"Connect failed rc={rc}")


def on_disconnect(client, userdata, rc, properties=None):
    LOG.warning(f"Disconnected rc={rc}")


def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode("utf-8", errors="replace")
    except Exception:
        payload = str(msg.payload)
    # Simple print, same as your snippet
    print(f"[MQTT] Topic: {msg.topic} | Message: {payload}", flush=True)


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
        while not _should_stop:
            try:
                client.connect(MQTT_HOST, MQTT_PORT, keepalive=MQTT_KEEPALIVE)
                client.loop_start()
                while not _should_stop:
                    time.sleep(0.3)
                break
            except Exception as e:
                LOG.error(f"Connect error: {e} (retry in {backoff}s)")
                time.sleep(backoff)
                backoff = min(backoff * 2, 20)
            finally:
                try:
                    client.loop_stop()
                    client.disconnect()
                except Exception:
                    pass
