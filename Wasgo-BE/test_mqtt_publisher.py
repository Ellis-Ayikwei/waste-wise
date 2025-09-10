import paho.mqtt.client as mqtt
import json
import time
import datetime


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker")
    else:
        print(f"Failed to connect, return code {rc}")


def on_publish(client, userdata, mid):
    print(f"Message {mid} published")


# Create client
client = mqtt.Client()
client.on_connect = on_connect
client.on_publish = on_publish

# Connect to broker (using HiveMQ public broker)
client.connect("broker.hivemq.com", 1883, 60)

# Start the loop
client.loop_start()

# Publish test messages
topic = "wasgo/sensors/readings"

# Loop that increases fill level from 1% to 100%
sensor_id = "SENSOR-00001"
bin_id = "BIN001"
base_weight = 0.5  # Starting weight in kg
base_temperature = 25.0  # Starting temperature

print("Starting sensor simulation - Fill level will increase from 1% to 100%")
print("Press Ctrl+C to stop the simulation")

try:
    for fill_level in range(1, 101):  # 1% to 100%
        # Calculate dynamic values based on fill level
        weight_kg = base_weight + (fill_level * 0.2)  # Weight increases with fill level
        temperature = base_temperature + (
            fill_level * 0.1
        )  # Temperature increases slightly
        humidity = 50 + (fill_level * 0.3)  # Humidity increases with fill level
        battery_level = max(20, 100 - (fill_level * 0.5))  # Battery decreases over time
        signal_strength = max(30, 100 - (fill_level * 0.2))  # Signal decreases slightly

        # Determine motion and lid status based on fill level
        motion_detected = fill_level > 50  # Motion detected when bin is half full
        lid_open = fill_level > 80  # Lid might be open when bin is very full

        # Create message
        message = {
            "sensor_id": sensor_id,
            "bin_id": bin_id,
            "fill_level": fill_level,
            "weight_kg": round(weight_kg, 1),
            "temperature": round(temperature, 1),
            "humidity": round(humidity, 1),
            "battery_level": round(battery_level),
            "signal_strength": round(signal_strength),
            "motion_detected": motion_detected,
            "lid_open": lid_open,
            "error_code": "",
            "timestamp": datetime.datetime.now().isoformat() + "Z",
        }

        # Publish message
        payload = json.dumps(message)
        result = client.publish(topic, payload)

        # Print status
        status_emoji = "🟢" if fill_level < 50 else "🟡" if fill_level < 80 else "🔴"
        print(
            f"{status_emoji} Fill Level: {fill_level}% | Weight: {weight_kg:.1f}kg | Temp: {temperature:.1f}°C | Battery: {battery_level:.0f}%"
        )

        # Wait 3 seconds before next message
        time.sleep(3)

except KeyboardInterrupt:
    print("\n🛑 Simulation stopped by user")

# Stop the loop
client.loop_stop()
client.disconnect()
print("Publisher finished")
