#!/usr/bin/env python3
"""
Test script to send sensor data to MQTT broker
"""
import json
import time
import paho.mqtt.client as mqtt
import random

# MQTT Configuration
MQTT_HOST = "test.mosquitto.org"
MQTT_PORT = 1883
MQTT_TOPIC = "wasgo/sensors/readings"


def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT broker with result code {rc}")


def on_publish(client, userdata, mid):
    print(f"Message {mid} published successfully")


def generate_sensor_data():
    """Generate random sensor data"""
    return {
        "sensor_id": "sensor_001",
        "bin_id": "bin_001",
        "lat": 5.6037 + random.uniform(-0.01, 0.01),
        "lon": -0.1870 + random.uniform(-0.01, 0.01),
        "sats": random.randint(4, 12),
        "alt": random.uniform(10, 50),
        "distance_cm": random.uniform(5, 40),
        "fill_level": random.uniform(0, 100),
        "weight_kg": random.uniform(0, 50),
        "temperature": random.uniform(15, 35),
        "humidity": random.uniform(30, 80),
        "battery_level": random.uniform(85, 100),
        "signal_strength": random.uniform(70, 100),
        "motion_detected": random.choice([True, False]),
        "lid_open": random.choice([True, False]),
    }


def main():
    # Create MQTT client
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_publish = on_publish

    try:
        # Connect to broker
        print(f"Connecting to {MQTT_HOST}:{MQTT_PORT}")
        client.connect(MQTT_HOST, MQTT_PORT, 60)
        client.loop_start()

        # Send test data every 5 seconds
        for i in range(10):
            data = generate_sensor_data()
            payload = json.dumps(data)

            print(f"\n=== Sending Test Data #{i+1} ===")
            print(f"Topic: {MQTT_TOPIC}")
            print(f"Payload: {payload}")

            result = client.publish(MQTT_TOPIC, payload)
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                print("✅ Message sent successfully")
            else:
                print(f"❌ Failed to send message: {result.rc}")

            time.sleep(5)

    except KeyboardInterrupt:
        print("\nStopping test...")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.loop_stop()
        client.disconnect()
        print("Test completed")


if __name__ == "__main__":
    main()
