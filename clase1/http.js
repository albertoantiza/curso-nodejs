const http = require('node:http')
const { findAvailablePort } = require('./clase/free-port.js')

console.log(process.env)

const desiredPort = process.env.PORT ?? 3400

const processRequest = (req, res) => {
  console.log('request received: ', req.url)
  res.end('Hola mundo')
}

const server = http.createServer(processRequest)

findAvailablePort(desiredPort).then(port => {
  server.listen(port => {
    console.log(`server listenning in port http://localhost:${port}`)
  })
})
