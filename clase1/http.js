const http = require('node:http')
const { findAvailablePort } = require('./free-port.js')

console.log(process.env)

const desiredPort = process.env.PORT ?? 3000

const server = http.createServer((req, res) => {
    console.log('request received')
    res.end('Hola mundo')
})

findAvailablePort(desiredPort).then(port => {
    server.listen(port => {
        console.log(`server listenning in port http://localhost:${port}`)
    })
})
