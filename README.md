<p align="center">
  <img src="https://github.com/ream88/homebridge-esp8266-example/blob/master/logo.png" height="150">
</p>

# homebridge-esp8266-example

This is an example for building custom HomeKit appliances using [Homebridge](https://homebridge.io) and ESP8266-based microcontrollers.

## [sketch](/sketch)

This is an Arduino sketch for any ESP8266-based microcontroller which allows the built-in LED to be toggled on and off via a simple HTTP API:

```
curl http://10.0.0.34
# => "on" or "off"

curl -d on http://10.0.0.34
# => "on"

curl -d off http://10.0.0.34
# => "off"
```

### Usage

Be sure to create a `sketch/config.h` based on `sketch/config.example.h` using your WiFi credentials. Either use the Arduino IDE or [something which builds upon the IDE](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-arduino) to compile and flash this sketch onto the microcontroller. After booting and obtaining an IP the HTTP API should be ready and accepting your requests.

## [homebridge-esp8266-plugin](/homebridge-esp8266-plugin)

This is a custom Homebridge plugin providing a simple switch accessory which allows you to toggle the LED via  the Home app on iOS/macOS or by using Siri on your Apple device including HomePod.

### Usage

Nothing to special here, just install the dependencies and start Homebridge:

```
npm install
npm start
```

## TODOs

- [ ] Implement [bonjour](https://www.npmjs.com/package/bonjour) to get rid of fixed IPs.
- [ ] Switch from a single accessary to a HomeKit platform with multiple ones.
- [ ] Try out MQTT.
