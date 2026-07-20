import express, { type Request, type Response, type NextFunction } from 'express'

interface Job {
  id: number
  company: string
  role: string
}

let requestCount = 0

const app = express()
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  if (_req.method === 'OPTIONS') { res.status(204).end(); return }
  next()
})
app.disable('x-powered-by')
app.use(express.json())
app.use((_req: Request, _res: Response, next: NextFunction) => { requestCount++; next() })
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  res.on('finish', () => console.log(`${req.ip} ${req.method} ${req.url} ${res.statusCode} ${Date.now() - start}ms`))
  next()
})

const hits = new Map<string, number[]>()
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setTimeout(10000, () => res.status(408).json({ error: 'request timeout' }))
  const window = (hits.get(req.ip!) ?? []).filter(t => t > Date.now() - 60000)
  if (window.length >= 100) return res.status(429).json({ error: 'too many requests' })
  window.push(Date.now())
  hits.set(req.ip!, window)
  next()
})

app.use((req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.is('json')) return res.status(415).json({ error: 'Content-Type must be application/json' })
  next()
})

app.set('trust proxy', 1)
app.use((req: Request, res: Response, next: NextFunction) => { res.set('X-Request-Id', crypto.randomUUID()); next() })

const jobs: Job[] = [
  { id: 1, company: 'Acme', role: 'Backend Developer' }
]

app.get('/', (_req: Request, res: Response) => {
  res.json({ endpoints: [{ path: '/health', method: 'GET' }, { path: '/stats', method: 'GET' }, { path: '/ping', method: 'GET' }, { path: '/jobs', method: 'GET' }, { path: '/jobs', method: 'POST' }, { path: '/jobs/search?q=', method: 'GET' }, { path: '/jobs/:id', methods: ['GET', 'PUT', 'DELETE'] }] })
})
app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true })
})
app.get('/ping', (_req: Request, res: Response) => {
  res.send('pong')
})
app.get('/stats', (_req: Request, res: Response) => {
  res.json({ totalJobs: jobs.length, requests: requestCount, uptime: process.uptime() })
})

app.head('/jobs', (req: Request, res: Response) => { res.set('X-Total-Count', String(jobs.length)); res.end() })
app.head('/jobs/:id', (req: Request, res: Response) => { const job = jobs.find(j => j.id === Number(req.params.id)); res.status(job ? 200 : 404).end() })
app.get('/time', (_req: Request, res: Response) => { res.json({ iso: new Date().toISOString(), unix: Date.now() }) })
app.get('/env', (_req: Request, res: Response) => { res.json({ node: process.version, platform: process.platform, env: process.env.NODE_ENV ?? 'development', pid: process.pid }) })
app.get('/echo', (req: Request, res: Response) => { res.json({ headers: req.headers, method: req.method, url: req.url, ip: req.ip }) })
app.get('/memory', (_req: Request, res: Response) => { const { rss, heapTotal, heapUsed } = process.memoryUsage(); res.json({ rss, heapTotal, heapUsed }) })
app.get('/version', (_req: Request, res: Response) => { res.json({ version: '1.0.0', uptime: process.uptime() }) })

app.get('/jobs', (req: Request, res: Response) => {
  const { q, page = '1', limit = '10' } = req.query
  if (Number(page) < 1 || Number(limit) < 1)
    return res.status(400).json({ error: 'page and limit must be positive' })
  let result = jobs
  if (q && typeof q === 'string') {
    result = jobs.filter(j => j.company.toLowerCase().includes(q.toLowerCase()) || j.role.toLowerCase().includes(q.toLowerCase()))
  }
  const start = (Number(page) - 1) * Number(limit)
  res.set('X-Total-Count', String(result.length))
  res.json({ data: result.slice(start, start + Number(limit)), total: result.length })
})

app.post('/jobs', (req: Request, res: Response) => {
  const { company, role } = req.body

  if (typeof company !== 'string' || typeof role !== 'string' || !company.trim() || !role.trim()) {
    res.status(400).json({ error: 'company and role are required' })
    return
  }

  const newJob: Job = {
    id: jobs.length + 1,
    company: company.trim(),
    role: role.trim()
  }

  jobs.push(newJob)

  res.status(201).json(newJob)
})

app.get('/jobs/:id', (req: Request, res: Response) => {
  const job = jobs.find(j => j.id === Number(req.params.id))
  if (!job) return res.status(404).json({ error: 'job not found' })
  res.json(job)
})
app.put('/jobs/:id', (req: Request, res: Response) => {
  const { company, role } = req.body
  if (typeof company !== 'string' || typeof role !== 'string' || !company.trim() || !role.trim())
    return res.status(400).json({ error: 'company and role are required' })
  const i = jobs.findIndex(j => j.id === Number(req.params.id))
  if (i === -1) return res.status(404).json({ error: 'job not found' })
  jobs[i] = { id: jobs[i].id, company: company.trim(), role: role.trim() }
  res.json(jobs[i])
})
app.delete('/jobs/:id', (req: Request, res: Response) => {
  const idx = jobs.findIndex(j => j.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'job not found' })
  jobs.splice(idx, 1)
  res.status(204).end()
})

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'not found' })
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof SyntaxError ? 400 : 500
  res.status(status).json({ error: err.message })
})

process.on('unhandledRejection', console.error)
process.on('uncaughtException', console.error)

const port = Number(process.env.PORT) || 3000
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port} [${process.env.NODE_ENV ?? 'development'}]`)
})

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') console.error(`Port ${port} is already in use`)
  else console.error(err)
  process.exit(1)
})

process.on('SIGTERM', () => server.close(() => process.exit(0)))
process.on('SIGINT', () => server.close(() => process.exit(0)))

export type { Job }
export { app }
