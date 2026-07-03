import os from 'node:os';
console.log('uptime: ', os.uptime() / 60 / 60);
console.log('memoria total: ', os.totalmem() / 1024 / 1024);
console.log('memoria libre: ', os.freemem() / 1024 / 1024);
console.log('CPUs: ', os.cpus());
//# sourceMappingURL=index.js.map