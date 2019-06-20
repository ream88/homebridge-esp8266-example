<p align="center">
  <img src="https://github.com/ream88/homebridge-esp8266-example/blob/master/logo.png" width="382" />
</p>

# homebridge-esp8266-example

This is an example for building custom HomeKit appliances using
[Homebridge](https://homebridge.io) and ESP8266-based micro-controllers. It uses
[DNS-SD](http://www.dns-sd.org)/Bonjour/Zeroconf for service discovery and
[MQTT](http://mqtt.org) for communication between the Homebridge plugin and the
ESP8266 based micro-controller(s).

## [sketch](/sketch)

This is an Arduino sketch for any ESP8266-based micro-controller which allows
the built-in LED to be toggled on and off via MQTT:

```
mosquitto_sub -t esp8266/led/status
# => "on" or "off"

# Turn LED on
mosquitto_pub -t esp8266/led/action -m on

# Turn LED off
mosquitto_pub -t esp8266/led/action -m off
```

### Usage

Be sure to create a `sketch/config.h` based on `sketch/config.example.h` using
your WiFi credentials. Either use the Arduino IDE or [something which builds
upon the
IDE](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-arduino)
to compile and flash this sketch onto the micro-controller. After booting and
obtaining an IP, the ESP8266 searches for a MQTT broker and subscribes to it.

## [homebridge-esp8266-plugin](/homebridge-esp8266-plugin)

This is a custom Homebridge plugin providing a simple switch accessory which
allows you to toggle the LED via the Home app on iOS/macOS or by using Siri on
your Apple device including HomePod.

### Usage

Be sure to have [Docker](https://www.docker.com) and [Docker Compose](https://docs.docker.com/compose/) installed and running on your host, in my case a Raspberry Pi Zero W.
The included [docker-compose.yml](/docker-compose.yml) defines all the required services to get started, including

  - [Eclipse Mosquitto](https://mosquitto.org), a MQTT broker.
  - [Avahi](http://avahi.org), a DNS-SD/Bonjour/Zeroconf service, which helps discovering the MQTT broker inside your network without fiddleing with IP addresses.
  - [Homebride](https://homebridge.io), the actual Homebridge.

```
docker-compose up
```

# Links

- https://github.com/KhaosT/HAP-NodeJS/blob/81319b35d1588453cfcb1a823805643de7df74dc/lib/gen/HomeKitTypes.js
- https://smarthome-blogger.de/tutorial/esp8266-mqtt-tutorial/
