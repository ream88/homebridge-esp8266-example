# homebridge-esp8266-example

This is an example for building custom HomeKit appliances using [Homebride](https://homebridge.io) and ESP8266-based microcontrollers.

This project is split into two main components:

## [sketch](/sketch)

The first one is an Arduino sketch for any ESP8266-based microcontroller which allows the built-in LED to be toggled on and off via a simple HTTP API:

```
curl http://10.0.0.34
# => "on" or "off"

curl -d on http://10.0.0.34
# => "on"

curl -d off http://10.0.0.34
# => "off"
```

## [homebridge-esp8266-plugin](/homebridge-esp8266-plugin)

The second component is a custom Homebridge plugin providing a simple switch accessory which allows you to toggle the LED via  the Home app on iOS/macOS or by using Siri on your Apple device including HomePod.

