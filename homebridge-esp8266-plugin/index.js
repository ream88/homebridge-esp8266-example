const { Service, Characteristic } = require('hap-nodejs')

class D1Mini {
  constructor (log, config) {
    this.log = log

    this.switchService = new Service.Switch(config['name'])

    this.switchService
      .getCharacteristic(Characteristic.On)
      .on('set', (value, callback) => { this.log(`Active: ${value}`); callback() })
  }

  getServices () {
    this.informationService = new Service.AccessoryInformation()
    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Mario Uher')
      .setCharacteristic(Characteristic.Model, 'LOLIN D1 mini')

    return [this.informationService, this.switchService]
  }

  getSwitchOnCharacteristic (callback) {
    return callback(null, this.state)
  }

  setSwitchOnCharacteristic (value, callback) {
    this.state = value
    console.log('state set to', this.state)

    return callback()
  }
}

module.exports = (homebridge) => {
  homebridge.registerAccessory('esp8266', 'esp8266', D1Mini)
}
