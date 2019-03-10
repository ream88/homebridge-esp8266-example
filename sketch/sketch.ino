#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include "./config.h"

// https://forum.arduino.cc/index.php?topic=399857.0
#define LED_ON LOW
#define LED_OFF HIGH

ESP8266WebServer server(SERVER_PORT);

void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);

  Serial.begin(115200);
  while (!Serial)
  {
    // Wait for the serial port to connect
  }
  Serial.println();

  setupWiFi();
  setupWebServer();
}

void setupWiFi()
{
  // WiFi setup
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_NAME, WIFI_PASSWORD);

  Serial.print("Connecting to ");
  Serial.print(WIFI_NAME);
  Serial.print(" ");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }

  Serial.println(" done!");
}

void setupWebServer()
{
  server.on("/", HTTP_GET, handleRootRoute);
  server.on("/on", HTTP_POST, handleOnRoute);
  server.on("/off", HTTP_POST, handleOffRoute);

  server.begin();

  Serial.print("Server running at http://");
  Serial.print(WiFi.localIP());
  Serial.print(":");
  Serial.println(SERVER_PORT);
}

void handleRootRoute()
{
  Serial.println("GET /");

  server.send(200, "text/html", digitalRead(LED_BUILTIN) == LED_ON ? "on" : "off");
}

void handleOnRoute()
{
  Serial.println("POST /on");

  digitalWrite(LED_BUILTIN, LED_ON);
  server.send(204, "text/html", "");
}

void handleOffRoute()
{
  Serial.println("POST /off");

  digitalWrite(LED_BUILTIN, LED_OFF);
  server.send(204, "text/html", "");
}

void loop()
{
  server.handleClient();
}
