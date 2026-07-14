import net from 'node:net'

function findAvailablePort (desiredPort: number, maxRetries = 5): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer()

    server.listen(desiredPort, () => {
      const address = server.address()
      if (address === null || typeof address === 'string') {
        server.close(() => reject(new Error('Unexpected address type')))
        return
      }
      const { port } = address
      server.close(() => {
        resolve(port)
      })
    })

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE' && desiredPort !== 0) {
        if (maxRetries <= 0) return reject(err)
        findAvailablePort(0, maxRetries - 1).then(port => resolve(port))
      } else {
        reject(err)
      }
    })
  })
}

export { findAvailablePort }
