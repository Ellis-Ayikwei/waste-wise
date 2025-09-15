/************************************************************
   ESP32 Smart Bin – GPS + Ultrasonic + Random Sensor Data
   Publishes JSON to test.mosquitto.org every 5 seconds
   Using ArduinoJson for clean JSON generation
 ************************************************************/

// ---- Increase MQTT buffer BEFORE including PubSubClient ----
#define MQTT_MAX_PACKET_SIZE 1024

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
const char* ssid        = "Wokwi-GUEST";
const char* password    = "";
const char* mqtt_server = "test.mosquitto.org";

WiFiClient espClient;
PubSubClient client(espClient);
const char* topic_out   = "axioiii/gps/out";

// ===== Bin / Sensor Config =====
const float EMPTY_DISTANCE_MIN = 38.0;  // cm
const float EMPTY_DISTANCE_MAX = 40.0;  // cm
const float FULL_DISTANCE      = 5.0;   // cm
const char* SENSOR_ID = "sensor_001";
const char* BIN_ID    = "bin_001";

// ===== Helper: Random Generators =====
float randFloat(float min, float max) {
  return min + (max - min) * (random(1000) / 1000.0);
}
bool randBool() { return random(0, 2); }

// ===== MQTT Callback =====
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message on "); Serial.print(topic); Serial.print(": ");
  for (unsigned int i = 0; i < length; i++) Serial.print((char)payload[i]);
  Serial.println();
}

// ===== MQTT Reconnect =====
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32ClientGPS")) {
      Serial.println("connected");
      client.subscribe(topic_out);   // optional self-subscribe
    } else {
      Serial.print("failed, rc="); Serial.print(client.state());
      Serial.println(" retry in 5s");
      delay(5000);
    }
  }
}

// ===== Ultrasonic Distance =====
float getDistanceCM() {
  digitalWrite(trigPin, LOW); delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000); // 30 ms timeout
  if (duration == 0) return -1;                  // no echo
  return duration * 0.0343 / 2;                  // cm
}

// ===== Fill Level & Weight =====
float calcFill(float d) {
  if (d < 0) return 0;
  if (d >= EMPTY_DISTANCE_MIN) return 0;
  if (d <= FULL_DISTANCE)      return 100;
  float f = 100.0 - ((d - FULL_DISTANCE) /
                    (EMPTY_DISTANCE_MAX - FULL_DISTANCE)) * 100.0;
  return constrain(f, 0, 100);
}
float calcWeight(float fill) { return (fill / 100.0) * 50.0 + randFloat(-2, 2); }

// ===== Setup =====
void setup() {
  Serial.begin(115200);
  SerialGPS.begin(GPSBaud, SERIAL_8N1, RXPin, TXPin);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  randomSeed(analogRead(0));

  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000); Serial.print(".");
  }
  Serial.print("\nWiFi connected, IP: ");
  Serial.println(WiFi.localIP());

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  client.setBufferSize(1024);      // runtime guarantee

  Serial.println("ESP32 Smart-Bin Started with ArduinoJson");
}

// ===== Main Loop =====
unsigned long lastPublish = 0;

void loop() {
  if (!client.connected()) reconnectMQTT();
  client.loop();

  while (SerialGPS.available() > 0) gps.encode(SerialGPS.read());

  if (millis() - lastPublish > 5000) {
    lastPublish = millis();

    // Sensor readings
    float distance  = getDistanceCM();
    float fillLevel = calcFill(distance);
    float weight    = calcWeight(fillLevel);

    float temp      = randFloat(15.0, 35.0);
    float humidity  = randFloat(30.0, 80.0);
    float battery   = randFloat(85.0, 100.0);
    float signal    = randFloat(70.0, 100.0);
    bool motion     = randBool();
    bool lidOpen    = randBool();

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
    doc["temperature"] = temp;
    doc["humidity"] = humidity;
    doc["battery_level"] = battery;
    doc["signal_strength"] = signal;
    doc["motion_detected"] = motion;
    doc["lid_open"] = lidOpen;
    doc["error_code"] = "";

    // Convert to JSON string
    String payload;
    serializeJson(doc, payload);

    // Publish
    Serial.println("=== PUBLISHING DATA ===");
    Serial.println(payload);
    if (client.publish(topic_out, payload.c_str())) {
      Serial.println("✅ Message published");
    } else {
      Serial.print("❌ Publish failed, state: ");
      Serial.println(client.state());
    }
    Serial.println("========================");
  }
}
