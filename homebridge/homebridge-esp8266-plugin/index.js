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

    bonjour.findOne({ type: 'mqtt' }, ({ protocol, addresses, port }) => {
      this.log.info(`MQTT broker found at ${protocol}://${addresses[1]}:${port}`)

      this.mqtt = MQTT.connect(`${protocol}://${addresses[1]}:${port}`)

      this.mqtt.on('offline', () => {
        this.log.warn('MQTT offline!')
      })

      this.mqtt.on('error', (error) => {
        this.log.error(`MQTT error: ${error}!`)
      })

      this.mqtt.subscribe(MQTT_TOPIC_STATUS).then(() => {
        this.log.info(`Subscribed to ${MQTT_TOPIC_STATUS}`)

        this.mqtt.on('message', (topic, msg) => {
          this.log.info(`< [${topic}]: "${msg.toString()}"`)

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
    this.mqtt.publish(MQTT_TOPIC_ACTION, value ? 'on' : 'off').then(() => {
      this.log.info(`> [${MQTT_TOPIC_ACTION}]: "${value ? 'on' : 'off'}"`)
      callback()
    })
  }
}
