#include <TinyGPSPlus.h>
#include <HardwareSerial.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

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
const char* ssid        = "Jay's Galaxy S21 Ultra 5G";
const char* password    = "jamie5566";
const char* mqtt_server = "mqtt-dashboard.com";

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
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32ClientGPS")) {
      Serial.println("connected!");
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

  // Publish every 20 seconds
  if (millis() - lastPublish > 20000) {
    lastPublish = millis();

    // Ultrasonic reading
    float distance = getDistanceCM();
    float fillLevel = calculateFillLevel(distance);
    float weight = calculateWeight(fillLevel);

    // Create JSON document
    DynamicJsonDocument doc(1024);
    
    // Required fields for the MQTT listener
    doc["sensor_id"] = SENSOR_ID;
    doc["bin_id"] = BIN_ID;
    
    // GPS Data
    if (gps.location.isValid()) {
      doc["lat"] = gps.location.lat();
      doc["lon"] = gps.location.lng();
    } else {
      doc["lat"] = (float)NULL;
      doc["lon"] = (float)NULL;
    }
    
    doc["sats"] = gps.satellites.value();
    doc["alt"] = gps.altitude.meters();
    
    // Ultrasonic Data
    if (distance > 0) {
      doc["distance_cm"] = distance;
    } else {
      doc["distance_cm"] = (float)NULL;
    }
    
    // Calculated fill level
    doc["fill_level"] = fillLevel;
    
    // Generated sensor data
    doc["weight_kg"] = weight;
    doc["temperature"] = generateRandomFloat(15.0, 35.0);  // 15-35°C
    doc["humidity"] = generateRandomFloat(30.0, 80.0);     // 30-80%
    doc["battery_level"] = generateRandomFloat(85.0, 100.0); // 85-100%
    doc["signal_strength"] = generateRandomFloat(70.0, 100.0); // 70-100%
    doc["motion_detected"] = generateRandomBool();          // Random motion detection
    doc["lid_open"] = generateRandomBool();                 // Random lid status
    doc["error_code"] = "";                                // No errors for now
    
    // Convert to JSON string
    String payload;
    serializeJson(doc, payload);

    Serial.print("Publishing: ");
    Serial.println(payload);
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.print("cm, Fill Level: ");
    Serial.print(fillLevel);
    Serial.print("%, Weight: ");
    Serial.print(weight);
    Serial.println("kg");

    client.publish(topic_out, payload.c_str());
  }
}
