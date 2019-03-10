const { Service, Characteristic } = require('hap-nodejs')
const http = require('http')

class D1Mini {
  constructor (log, config) {
    this.log = log

    this.switchService = new Service.Switch(config['name'])

    this.switchService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getSwitchOnCharacteristic.bind(this))
      .on('set', this.setSwitchOnCharacteristic.bind(this))

    http
      .request({
        method: 'GET',
        hostname: '10.0.0.34',
        port: 80,
        path: '/'
      })
      .on('response', (response) => {
        let body = ''

        response.on('data', (data) => {
          body += data
        })

        response.on('end', () => {
          this.switchService
            .getCharacteristic(Characteristic.On)
            .setValue(body === 'on')
        })
      })
      .on('error', (error) => this.log.error(error.message))
      .end()
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
      .request({
        method: 'GET',
        hostname: '10.0.0.34',
        port: 80,
        path: '/'
      })
      .on('response', (response) => {
        let body = ''

        response.on('data', (data) => {
          body += data
        })

        response.on('end', () => {
          callback(null, body === 'on')
        })
      })
      .on('error', (error) => this.log.error(error.message))
      .end()
  }

  setSwitchOnCharacteristic (value, callback) {
    this.log('setSwitchOnCharacteristic', value)

    http
      .request({
        method: 'POST',
        hostname: '10.0.0.34',
        port: 80,
        path: value ? '/on' : '/off'
      })
      .on('response', (response) => {
        callback()
      })
      .on('error', (error) => this.log.error(error.message))
      .end()
  }
}

module.exports = (homebridge) => {
  homebridge.registerAccessory('esp8266', 'esp8266', D1Mini)
}
