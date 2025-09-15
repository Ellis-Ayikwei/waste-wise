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

  Serial.println("MQTT Test Started");
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
    
    Serial.println("=== PUBLISHING TEST MESSAGE ===");
    
    // Simple test message
    String testMessage = "Test message #" + String(messageCount) + " from ESP32";
    
    Serial.print("Publishing: ");
    Serial.println(testMessage);
    
    // Publish with QoS 1 for reliability
    bool published = client.publish(topic_out, testMessage.c_str(), true);
    if (published) {
      Serial.println("✅ Message published successfully!");
    } else {
      Serial.println("❌ Failed to publish message!");
    }
    Serial.println("=== END PUBLISH ===");
  }
}
