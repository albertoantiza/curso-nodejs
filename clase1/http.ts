import http from 'node:http'
import { findAvailablePort } from './free-port.js'

console.log(process.env)

const desiredPort = process.env.PORT ?? 3400

const processRequest = (req: http.IncomingMessage, res: http.ServerResponse) => {
  if (req.url === '/') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end('Bienvenido a mi página de inicio')
  }
}

const server = http.createServer(processRequest)

findAvailablePort(Number(desiredPort)).then(port => {
  server.listen(port, () => {
    console.log(`server listenning in port http://localhost:${port}`)
  })
})
