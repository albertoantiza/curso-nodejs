import net from 'node:net';
function findAvailablePort(desiredPort) {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.listen(desiredPort, () => {
            const address = server.address();
            if (address === null || typeof address === 'string') {
                server.close(() => reject(new Error('Unexpected address type')));
                return;
            }
            const { port } = address;
            server.close(() => {
                resolve(port);
            });
        });
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE' && desiredPort !== 0) {
                findAvailablePort(0).then(port => resolve(port));
            }
            else {
                reject(err);
            }
        });
    });
}
export { findAvailablePort };
//# sourceMappingURL=free-port.js.map