import os from 'node:os'

console.log('platform: ', os.platform())
console.log('hostname: ', os.hostname())
console.log(`uptime: ${Math.floor(os.uptime() / 3600)}h ${Math.floor((os.uptime() % 3600) / 60)}m`)
console.log('memoria total: ', os.totalmem() / 1024 / 1024)
console.log('memoria libre: ', os.freemem() / 1024 / 1024)
console.log('CPUs: ', os.cpus().length)
