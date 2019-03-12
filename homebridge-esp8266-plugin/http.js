const http = require('http')

const defaultOptions = {
  host: '127.0.0.1',
  path: '/',
  port: 80,
  timeout: 5000
}

const request = (options) =>
  new Promise((resolve, reject) => {
    const body = options.body
    delete options.body

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
      .end(body)
  })

module.exports = {
  request: request
}
