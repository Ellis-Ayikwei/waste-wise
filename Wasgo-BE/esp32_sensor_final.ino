#include <TinyGPSPlus.h>
#include <HardwareSerial.h>
#include <WiFi.h>
#include <PubSubClient.h>

// ===== GPS Setup =====
TinyGPSPlus gps;
HardwareSerial SerialGPS(2);

static const int RXPin = 16;
static const int TXPin = 17;
static const uint32_t GPSBaud = 9600;

// ===== Ultrasonic Setup =====
const int trigPin = 27;   // TRIG
const int echoPin = 26;   // ECHO

// ===== WiFi + MQTT Setup =====
const char* ssid        = "Wokwi-GUEST";
const char* password    = "";
const char* mqtt_server = "test.mosquitto.org";

WiFiClient espClient;
PubSubClient client(espClient);

// MQTT topic
const char* topic_out   = "axioiii/gps/out";

// ===== Sensor Configuration =====
// Bin configuration - adjust these values based on your bin
const float EMPTY_DISTANCE_MIN = 38.0;  // cm - bin is empty
const float EMPTY_DISTANCE_MAX = 40.0;  // cm - bin is empty
const float FULL_DISTANCE = 5.0;        // cm - bin is full (adjust based on your bin height)

// Sensor IDs - you'll need to replace these with actual IDs from your database
const char* SENSOR_ID = "sensor_001";
const char* BIN_ID = "bin_001";

// ===== Random Data Generation =====
float generateRandomFloat(float min, float max) {
  return min + (max - min) * (random(1000) / 1000.0);
}

int generateRandomInt(int min, int max) {
  return random(min, max + 1);
}

bool generateRandomBool() {
  return random(0, 2) == 1;
}

// ===== Functions =====
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
    if (client.connect("ESP32ClientGPS")) {
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

float getDistanceCM() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000); // 30ms timeout
  float distance = duration * 0.0343 / 2;        // cm

  if (duration == 0) return -1; // no echo
  return distance;
}

float calculateFillLevel(float distance) {
  if (distance < 0) return 0; // Invalid reading
  
  // If distance is in empty range, bin is empty
  if (distance >= EMPTY_DISTANCE_MIN && distance <= EMPTY_DISTANCE_MAX) {
    return 0;
  }
  
  // If distance is less than full distance, bin is full
  if (distance <= FULL_DISTANCE) {
    return 100;
  }
  
  // Calculate fill level based on distance
  // Linear interpolation between empty and full distances
  float fillLevel = 100.0 - ((distance - FULL_DISTANCE) / (EMPTY_DISTANCE_MAX - FULL_DISTANCE)) * 100.0;
  
  // Clamp between 0 and 100
  if (fillLevel < 0) fillLevel = 0;
  if (fillLevel > 100) fillLevel = 100;
  
  return fillLevel;
}

float calculateWeight(float fillLevel) {
  // Estimate weight based on fill level
  // Assuming max weight of 50kg when full
  return (fillLevel / 100.0) * 50.0 + generateRandomFloat(-2.0, 2.0);
}

void setup() {
  Serial.begin(115200);
  SerialGPS.begin(GPSBaud, SERIAL_8N1, RXPin, TXPin);

  // Ultrasonic pins
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // Initialize random seed
  randomSeed(analogRead(0));

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

  Serial.println("ESP32 + NEO-6M + JSN-SR04T Started");
  Serial.println("Enhanced with random sensor data generation");
}

unsigned long lastPublish = 0;

void loop() {
  if (!client.connected()) reconnectMQTT();
  client.loop();

  while (SerialGPS.available() > 0) {
    gps.encode(SerialGPS.read());
  }

  // Publish every 5 seconds
  if (millis() - lastPublish > 5000) {
    Serial.println("=== PUBLISHING DATA ===");
    lastPublish = millis();

    // Ultrasonic reading
    float distance = getDistanceCM();
    float fillLevel = calculateFillLevel(distance);
    float weight = calculateWeight(fillLevel);

    // Build JSON payload with minimal memory usage
    char payload[512]; // Fixed buffer size
    char temp[32];
    
    // Generate random values once to avoid multiple calls
    float temp_val = generateRandomFloat(15.0, 35.0);
    float humidity_val = generateRandomFloat(30.0, 80.0);
    float battery_val = generateRandomFloat(85.0, 100.0);
    float signal_val = generateRandomFloat(70.0, 100.0);
    bool motion_val = generateRandomBool();
    bool lid_val = generateRandomBool();
    
    // Build JSON using snprintf for memory efficiency
    if (gps.location.isValid()) {
      snprintf(payload, sizeof(payload),
        "{\"sensor_id\":\"%s\",\"bin_id\":\"%s\",\"lat\":%.6f,\"lon\":%.6f,\"sats\":%d,\"alt\":%.1f,\"distance_cm\":%.2f,\"fill_level\":%.1f,\"weight_kg\":%.2f,\"temperature\":%.1f,\"humidity\":%.1f,\"battery_level\":%.1f,\"signal_strength\":%.1f,\"motion_detected\":%s,\"lid_open\":%s,\"error_code\":\"\"}",
        SENSOR_ID, BIN_ID, gps.location.lat(), gps.location.lng(), 
        gps.satellites.value(), gps.altitude.meters(), distance, fillLevel, weight,
        temp_val, humidity_val, battery_val, signal_val,
        motion_val ? "true" : "false", lid_val ? "true" : "false"
      );
    } else {
      snprintf(payload, sizeof(payload),
        "{\"sensor_id\":\"%s\",\"bin_id\":\"%s\",\"lat\":null,\"lon\":null,\"sats\":%d,\"alt\":%.1f,\"distance_cm\":%.2f,\"fill_level\":%.1f,\"weight_kg\":%.2f,\"temperature\":%.1f,\"humidity\":%.1f,\"battery_level\":%.1f,\"signal_strength\":%.1f,\"motion_detected\":%s,\"lid_open\":%s,\"error_code\":\"\"}",
        SENSOR_ID, BIN_ID, gps.satellites.value(), gps.altitude.meters(), 
        distance, fillLevel, weight, temp_val, humidity_val, battery_val, signal_val,
        motion_val ? "true" : "false", lid_val ? "true" : "false"
      );
    }

    Serial.print("Publishing: ");
    Serial.println(payload);
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.print("cm, Fill Level: ");
    Serial.print(fillLevel);
    Serial.print("%, Weight: ");
    Serial.print(weight);
    Serial.println("kg");

    // Publish with QoS 0 (no acknowledgment required)
    bool published = client.publish(topic_out, payload, false);
    if (published) {
      Serial.println("✅ Message published successfully!");
    } else {
      Serial.println("❌ Failed to publish message!");
      Serial.print("MQTT state: ");
      Serial.println(client.state());
    }
    
    // Give MQTT time to process the message
    delay(100);
    client.loop();
    
    Serial.println("=== END PUBLISH ===");
  }
}
