#include <ESP8266WiFi.h>
#include "config.h"

void setup()
{
  Serial.begin(115200);

  // Wait for the serial port to connect
  while (!Serial)
  {
  }
  Serial.println();

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_NAME, WIFI_PASSWORD);

  Serial.print("Connecting to ");
  Serial.println(WIFI_NAME);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("Connection established!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop()
{
}
