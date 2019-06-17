const { Characteristic, Service } = require('hap-nodejs')
const bonjour = require('bonjour')()
const MQTT = require('async-mqtt')

const MQTT_TOPIC_ACTION = 'esp8266/led/action'
const MQTT_TOPIC_STATUS = 'esp8266/led/status'
const PLATFORM_NAME = 'esp8266-switch'
const PLUGIN_NAME = 'homebridge-esp8266-plugin'

module.exports = (homebridge) => {
  homebridge.registerAccessory(PLUGIN_NAME, PLATFORM_NAME, ESP8266Switch)
}

class ESP8266Switch {
  constructor (log, config) {
    this.log = log
    this.config = config

    this.service = new Service.Switch(this.config['name'])
    this.service
      .getCharacteristic(Characteristic.On)
      .on('set', this.setOnCharacteristic.bind(this))

    bonjour.findOne({ type: 'mqtt' }, ({ protocol, host, port }) => {
      this.mqtt = MQTT.connect(`${protocol}://${host}:${port}`)
      this.mqtt.subscribe(MQTT_TOPIC_STATUS).then(() => {
        this.mqtt.on('message', (topic, msg) => {
          if (topic === MQTT_TOPIC_STATUS) {
            this.service
              .getCharacteristic(Characteristic.On)
              .updateValue(msg.toString() === 'on')
          }
        })
      })
    })
  }

  // @implements {homebridge/lib/server.js}
  getServices () {
    const info = new Service.AccessoryInformation()
      .setCharacteristic(Characteristic.Manufacturer, 'Mario Uher')
      .setCharacteristic(Characteristic.Model, 'LOLIN D1 mini')

    return [info, this.service]
  }

  setOnCharacteristic (value, callback) {
    this.mqtt.publish(MQTT_TOPIC_ACTION, value ? 'on' : 'off')
    callback()
  }
}
