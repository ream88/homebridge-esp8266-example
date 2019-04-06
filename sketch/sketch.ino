#include <ESP8266mDNS.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>

#include "./config.h"

// https://forum.arduino.cc/index.php?topic=399857.0
#define LED_ON LOW
#define LED_OFF HIGH

ESP8266WebServer server(SERVER_PORT);
MDNSResponder mdns;

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
  setupWebServer();
  setupBonjour();
}

void setupWiFi()
{
  // WiFi setup
  WiFi.mode(WIFI_STA);
  WiFi.hostname(accessoryName);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to ");
  Serial.print(WIFI_SSID);
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
  server.on("/", HTTP_GET, handleGetRoute);
  server.on("/", HTTP_POST, handlePostRoute);

  server.begin();

  Serial.print("Server running at http://");
  Serial.print(WiFi.localIP());
  Serial.print(":");
  Serial.println(SERVER_PORT);
}

void setupBonjour()
{
  if (mdns.begin(accessoryName, WiFi.localIP()))
  {
    Serial.println("MDNS responder started");
  }
  mdns.addService("homebridge", "tcp", SERVER_PORT);
  mdns.addServiceTxt("homebridge", "tcp", "type", "esp8266-switch");
  mdns.addServiceTxt("homebridge", "tcp", "mac", WiFi.macAddress());
}

void loop()
{
  server.handleClient();
  mdns.update();
}

void handleGetRoute()
{
  Serial.println("GET /");

  server.send(200, "text/html", website());
}

void handlePostRoute()
{
  Serial.println("POST /");

  String body = server.hasArg("data") ? server.arg("data") : server.arg("plain");

  if (body == "on")
  {
    digitalWrite(LED_BUILTIN, LED_ON);
    server.send(200, "text/html", website());
  }
  else if (body == "off")
  {
    digitalWrite(LED_BUILTIN, LED_OFF);
    server.send(200, "text/html", website());
  }
  else
  {
    server.send(400, "text/html", website());
  }
}

String status()
{
  return digitalRead(LED_BUILTIN) == LED_ON ? "on" : "off";
}

String website()
{
  String value = status() == "on" ? "off" : "on";
  String form = "<form action=\"/\" method=\"post\">"
                "<button name=\"data\" value=\"" +
                value +
                "\">toggle</button>"
                "</form>";

  return status() + "<br />" + form;
}
