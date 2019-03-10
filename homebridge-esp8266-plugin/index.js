const { Service, Characteristic } = require('hap-nodejs')
const http = require('./http')

class D1Mini {
  constructor (log, config) {
    this.log = log

    this.switchService = new Service.Switch(config['name'])

    this.switchService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getSwitchOnCharacteristic.bind(this))
      .on('set', this.setSwitchOnCharacteristic.bind(this))

    http
      .request({ method: 'GET', hostname: '10.0.0.34', path: '/' })
      .then((body) => {
        this.switchService.getCharacteristic(Characteristic.On).setValue(body === 'on')
      })
      .catch((error) => this.log.error(error.message))
  }

  getServices () {
    this.informationService = new Service.AccessoryInformation()
    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Mario Uher')
      .setCharacteristic(Characteristic.Model, 'LOLIN D1 mini')

    return [this.informationService, this.switchService]
  }

  getSwitchOnCharacteristic (callback) {
    this.log('getSwitchOnCharacteristic')

    http
      .request({ method: 'GET', hostname: '10.0.0.34', path: '/' })
      .then((body) => callback(null, body === 'on'))
      .catch((error) => this.log.error(error.message))
  }

  setSwitchOnCharacteristic (value, callback) {
    this.log('setSwitchOnCharacteristic', value)

    http
      .request({ method: 'POST', hostname: '10.0.0.34', path: value ? '/on' : '/off' })
      .then(() => callback())
      .catch((error) => this.log.error(error.message))
  }
}

module.exports = (homebridge) => {
  homebridge.registerAccessory('esp8266', 'esp8266', D1Mini)
}
