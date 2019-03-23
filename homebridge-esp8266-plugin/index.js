const { Characteristic, Service, uuid: UUID } = require('hap-nodejs')
const { PlatformAccessory } = require('homebridge/lib/platformAccessory')
const bonjour = require('bonjour')
const http = require('./http')
const mdnsResolver = require('mdns-resolver')

const PLUGIN_NAME = 'homebridge-esp8266-plugin'
const PLATFORM_NAME = 'esp8266-switch'

class D1MiniSwitchPlatform {
  constructor (log, config, api) {
    this.log = log
    this.config = config
    this.api = api
    this.accessories = {}
    this.bonjour = bonjour().find({ type: 'homebridge' })

    this.api.on('didFinishLaunching', () => {
      this.bonjour.on('up', (service) => {
        this.foundAccessory(service)
      })
    })
  }

  // Function invoked when homebridge tries to restore cached accessory
  configureAccessory (accessory) {
    this.log('Restore cached accessory')
    this.accessories[accessory.UUID] = accessory
  }

  async foundAccessory (service) {
    if (service.txt.type && service.txt.type === PLATFORM_NAME) {
      const uuid = UUID.generate(service.txt.mac)
      const host = await mdnsResolver.resolve4(service.host)
      const accessoryConfig = { host: host, port: service.port, name: service.name, serial: service.txt.mac }

      if (this.accessories[uuid]) {
        this.log(`Found existing esp8266-switch on ${host}:${service.port}`)

        this.startAccessory(this.accessories[uuid], accessoryConfig)
      } else {
        this.log(`Found new esp8266-switch on ${host}:${service.port}`)

        this.accessories[uuid] = new PlatformAccessory(PLATFORM_NAME, uuid)
        this.startAccessory(this.accessories[uuid], accessoryConfig)
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [this.accessories[uuid]])
      }
    }
  }

  startAccessory (accessory, config) {
    this.log('Start accessory')
    new D1MiniSwitch(accessory, this.log, config)
  }
}

module.exports = (homebridge) => {
  homebridge.registerPlatform(PLUGIN_NAME, PLATFORM_NAME, D1MiniSwitchPlatform, true)
}

class D1MiniSwitch {
  constructor (accessory, log, config) {
    this.log = log
    this.config = config

    accessory
    .getService(Service.AccessoryInformation)
    .setCharacteristic(Characteristic.Manufacturer, 'Mario Uher')
    .setCharacteristic(Characteristic.Model, 'esp8266')
    .setCharacteristic(Characteristic.SerialNumber, config.serial)

    if (!accessory.getService(Service.Switch)) {
      accessory.addService(Service.Switch, config.name)
    }
    accessory
      .getService(Service.Switch)
      .getCharacteristic(Characteristic.On)
      .on('get', this.getSwitchOnCharacteristic.bind(this))
      .on('set', this.setSwitchOnCharacteristic.bind(this))

    this.log('< GET /')
    http
      .request({ method: 'GET', hostname: this.config.host, path: '/' })
      .then((body) => {
        this.log(`> ${body}`)
        accessory.getService(Service.Switch).getCharacteristic(Characteristic.On).updateValue(body === 'on')
      })
      .catch((error) => this.log.error(error.message))
  }

  getSwitchOnCharacteristic (callback) {
    this.log('< GET /')

    http
      .request({ method: 'GET', hostname: this.config.host })
      .then((body) => {
        this.log(`> ${body}`)
        callback(null, body === 'on')
      })
      .catch((error) => this.log.error(error.message))
  }

  setSwitchOnCharacteristic (value, callback) {
    this.log('< POST /', value ? 'on' : 'off')

    http
      .request({ method: 'POST', hostname: this.config.host, body: value ? 'on' : 'off' })
      .then((body) => {
        this.log(`> ${body}`)
        callback()
      })
      .catch((error) => this.log.error(error.message))
  }
}
