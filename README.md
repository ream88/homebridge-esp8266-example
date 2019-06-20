<p align="center">
  <img src="https://github.com/ream88/homebridge-esp8266-example/blob/master/logo.png" width="382" />
</p>

# homebridge-esp8266-example

This is an example for building custom HomeKit appliances using
[Homebridge](https://homebridge.io) and ESP8266-based micro-controllers. It uses
[DNS-SD](http://www.dns-sd.org)/Bonjour/Zeroconf for service discovery and
[MQTT](http://mqtt.org) for communication between the Homebridge plugin and the
ESP8266 based micro-controller(s).

Be sure to have [Docker](https://www.docker.com) and [Docker
Compose](https://docs.docker.com/compose/) installed and running on your host,
in my case a Raspberry Pi Zero W. The included
[docker-compose.yml](/docker-compose.yml) defines all the required services to
get started, including

  - [Eclipse Mosquitto](https://mosquitto.org), a MQTT broker.
  - [Avahi](http://avahi.org), a DNS-SD/Bonjour/Zeroconf service, which helps
    discovering the MQTT broker inside your network without fiddling with IP
    addresses.
  - [Homebridge](https://homebridge.io), the actual Homebridge.

```
docker-compose up
```

```
mosquitto_sub -t esp8266/led/status
# => "on" or "off"

# Turn LED on
mosquitto_pub -t esp8266/led/action -m on

# Turn LED off
mosquitto_pub -t esp8266/led/action -m off
```

Before flashing the sketch onto your ESP8266, ensure to create a
`sketch/config.h` based on `sketch/config.example.h` using your WiFi
credentials. After booting and obtaining an IP, the ESP8266 searches for a MQTT
broker and subscribes to it. It will blink twice once it is ready.

## Links

- https://github.com/KhaosT/HAP-NodeJS/blob/81319b35d1588453cfcb1a823805643de7df74dc/lib/gen/HomeKitTypes.js
- https://smarthome-blogger.de/tutorial/esp8266-mqtt-tutorial/
