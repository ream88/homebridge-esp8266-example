<p align="center">
  <img src="https://github.com/ream88/homebridge-esp8266-example/blob/master/logo.png" width="382" />
</p>

# homebridge-esp8266-example

This is an example for building custom HomeKit appliances using
[Homebridge](https://homebridge.io) and ESP8266-based micro-controllers. It uses
[dns-sd](http://www.dns-sd.org) for service discovery and MQTT for communication
between the Homebridge plugin and the ESP8266 micro-controller(s).

## [sketch](/sketch)

This is an Arduino sketch for any ESP8266-based micro-controller which allows the
built-in LED to be toggled on and off via MQTT:

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

Nothing special here if you're used to Homebridge, just install the dependencies
and start Homebridge:

```
npm install
npm start
```

# Links

- https://github.com/KhaosT/HAP-NodeJS/blob/81319b35d1588453cfcb1a823805643de7df74dc/lib/gen/HomeKitTypes.js
- https://smarthome-blogger.de/tutorial/esp8266-mqtt-tutorial/
