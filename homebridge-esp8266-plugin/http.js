const http = require('http')

const defaultOptions = {
  port: 80,
  timeout: 5000
}

const request = (options) =>
  new Promise((resolve, reject) =>
    http
      .request(Object.assign(defaultOptions, options))
      .on('response', (response) => {
        let body = ''

        response.on('data', (data) => {
          body += data
        })

        response.on('end', () => {
          resolve(body)
        })
      })
      .on('error', (error) => reject(error))
      .end())

module.exports = {
  request: request
}
