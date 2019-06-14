#include <ESP8266mDNS.h>
#include <ESP8266WiFi.h>

#include "./config.h"

// https://forum.arduino.cc/index.php?topic=399857.0
#define LED_ON LOW
#define LED_OFF HIGH

char accessoryName[16] = {0};

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
}

void loop()
{
  MDNS.update();
}
