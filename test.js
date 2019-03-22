#!/usr/bin/env node

const bonjour = require('bonjour')()

bonjour.find({ type: 'led' }, (service) => {
  console.log('Found an ESP8266:', service)
})
