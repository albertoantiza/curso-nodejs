import http from 'node:http';
const desiredPort = process.env.PORT ?? 1234;
const processRequest = (req, res) => {
    if (req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Hola mundo página');
    }
};
const server = http.createServer(processRequest);
server.listen(Number(desiredPort), () => {
    console.log(`server listenning in port http://localhost:${desiredPort}`);
});
//# sourceMappingURL=http2.js.map