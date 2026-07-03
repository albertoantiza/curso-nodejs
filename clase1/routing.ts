import http from 'node:http'

const processRequest = (req: http.IncomingMessage, res: http.ServerResponse) => {
  const { method, url } = req

  switch (method) {
    case 'GET':
      if (url === '/') {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end('<h1>Bienvenido a mi página</h1>')
      } else {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end('<h1>404 Not Found</h1>')
      }
      break
    default:
      res.statusCode = 405
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end('<h1>405 Method Not Allowed</h1>')
      break
  }
}

const server = http.createServer(processRequest)

server.listen(1234, () => {
  console.log('server listenning on port http://localhost:1234')
})
