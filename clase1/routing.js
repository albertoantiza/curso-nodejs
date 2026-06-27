const http = require('node:http')

const processRequest = (req, res) => {
  const { method, url } = req

  switch (method) {
    a
  }
}

const server = http.createServer(processRequest)

server.listen(1234, () => {
  console.log('server listenning on port http://localhost:1234')
})