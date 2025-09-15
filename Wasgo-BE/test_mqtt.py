import paho.mqtt.client as mqtt
import time


def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe("axioiii/gps/out")
    print("Subscribed to axioiii/gps/out")


def on_message(client, userdata, msg):
    print(f"Received: {msg.payload.decode()}")


client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

print("Connecting to test.mosquitto.org...")
client.connect("test.mosquitto.org", 1883, 60)
client.loop_start()

print("MQTT test client started. Listening for 30 seconds...")
time.sleep(30)

client.loop_stop()
client.disconnect()
print("Test complete.")
