#include <WiFi.h>
#include <PubSubClient.h>

// ===== WiFi + MQTT Setup =====
const char* ssid        = "Wokwi-GUEST";
const char* password    = "";
const char* mqtt_server = "test.mosquitto.org";

WiFiClient espClient;
PubSubClient client(espClient);

// MQTT topic
const char* topic_out   = "axioiii/gps/out";

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received on topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32TestClient")) {
      Serial.println("connected!");
      // Subscribe to the topic to test
      client.subscribe("axioiii/gps/out");
      Serial.println("Subscribed to axioiii/gps/out");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  // WiFi connect
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  Serial.println("Simple MQTT Test Started");
}

unsigned long lastPublish = 0;
int messageCount = 0;

void loop() {
  if (!client.connected()) reconnectMQTT();
  client.loop();

  // Publish every 3 seconds
  if (millis() - lastPublish > 3000) {
    lastPublish = millis();
    messageCount++;
    
    Serial.println("=== PUBLISHING SIMPLE MESSAGE ===");
    
    // Very simple test message
    String testMessage = "Hello " + String(messageCount);
    
    Serial.print("Publishing: ");
    Serial.println(testMessage);
    
    // Publish with QoS 0
    bool published = client.publish(topic_out, testMessage.c_str(), false);
    if (published) {
      Serial.println("✅ Simple message published successfully!");
    } else {
      Serial.println("❌ Failed to publish simple message!");
      Serial.print("MQTT state: ");
      Serial.println(client.state());
    }
    
    // Give MQTT time to process
    delay(100);
    client.loop();
    
    Serial.println("=== END SIMPLE PUBLISH ===");
  }
}
