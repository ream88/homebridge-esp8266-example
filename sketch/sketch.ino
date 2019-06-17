#include <ESP8266mDNS.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include "./config.h"

// https://forum.arduino.cc/index.php?topic=399857.0
#define LED_ON LOW
#define LED_OFF HIGH

#define MQTT_TOPIC_ACTION "esp8266/led/action"
#define MQTT_TOPIC_STATUS "esp8266/led/status"

// The interval in which the status is reported.
#define MQTT_INTERVAL 5000

char accessoryName[16] = {0};
unsigned long lastLoop = 0;

WiFiClient wifi;
PubSubClient mqtt(wifi);

void setup()
{
  sprintf(accessoryName, "esp8266_%08X", ESP.getChipId());
  pinMode(LED_BUILTIN, OUTPUT);

  Serial.begin(115200);
  while (!Serial)
  {
    // Wait for the serial port to connect
  }
  Serial.println();

  setupWiFi();
  setupMDNS();
  setupMQTT();
  blink(2);
}

void setupWiFi()
{
  WiFi.mode(WIFI_STA);
  WiFi.hostname(accessoryName);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to ");
  Serial.print(WIFI_SSID);
  Serial.print(" ");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(250);
    Serial.print(".");
  }

  Serial.println(" done!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.print("accessoryName: ");
  Serial.print(accessoryName);
  Serial.println(".local");
}

void setupMDNS()
{
  if (MDNS.begin(accessoryName, WiFi.localIP()))
  {
    Serial.println("MDNS responder started");
  }

  int mqttServices = MDNS.queryService("homebridge", "tcp");
  if (mqttServices == 0)
  {
    Serial.println("No MQTT broker found!");
  }
  else
  {
    Serial.print("MQTT broker found at ");
    Serial.println(MDNS.IP(0));
  }
}

void setupMQTT()
{
  mqtt.setServer(MDNS.IP(0), 1883);
  mqtt.setCallback(callback);
}

void blink(int count)
{
  for (int i = 0; i < count; i++)
  {
    digitalWrite(LED_BUILTIN, LED_OFF);
    delay(150);
    digitalWrite(LED_BUILTIN, LED_ON);
    delay(150);
    digitalWrite(LED_BUILTIN, LED_OFF);
  }
}

void connectMQTT()
{
  while (!mqtt.connected())
  {
    Serial.print("Connecting to MQTT broker, ");
    if (!mqtt.connect(accessoryName))
    {
      Serial.print("failed with ");
      Serial.print(mqtt.state());
      Serial.println(", retrying in 5 seconds!");
      delay(5000);
    }
    else
    {
      Serial.println("done, subscribed to ");
      mqtt.subscribe(MQTT_TOPIC_ACTION);
      Serial.println(MQTT_TOPIC_ACTION);
    }
  }
}

void loop()
{
  MDNS.update();
  connectMQTT();
  mqtt.loop();
  publishStatus();
}

const char *status()
{
  return digitalRead(LED_BUILTIN) == LED_ON ? "on" : "off";
}

void publishStatus()
{
  if (millis() - lastLoop >= MQTT_INTERVAL)
  {
    lastLoop += MQTT_INTERVAL;
    mqtt.publish(MQTT_TOPIC_STATUS, status());
  }
}

char *readPayload(byte *payload, unsigned int length)
{
  char output[length + 1];

  for (int i = 0; i < length; i++)
  {
    output[i] = (char)payload[i];
  }

  output[length] = '\0';

  return output;
}

void callback(char *topic, byte *payload, unsigned int length)
{

  char *msg = readPayload(payload, length);

  Serial.print("Received message \"");
  Serial.print(msg);
  Serial.println("\"");

  if (strcmp(msg, "on") == 0)
  {
    digitalWrite(LED_BUILTIN, LED_ON);
    mqtt.publish(MQTT_TOPIC_STATUS, status());
  }
  else if (strcmp(msg, "off") == 0)
  {
    digitalWrite(LED_BUILTIN, LED_OFF);
    mqtt.publish(MQTT_TOPIC_STATUS, status());
  }
}
