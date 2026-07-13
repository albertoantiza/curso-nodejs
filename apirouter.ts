import express, { type Request, type Response, type NextFunction } from 'express'

interface Job {
  id: number
  company: string
  role: string
}

const app = express()
app.use(express.json())
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  res.on('finish', () => console.log(`${req.method} ${req.url} ${res.statusCode} ${Date.now() - start}ms`))
  next()
})

const jobs: Job[] = [
  { id: 1, company: 'Acme', role: 'Backend Developer' }
]

app.get('/', (_req: Request, res: Response) => {
  res.json({ endpoints: [{ path: '/health', method: 'GET' }, { path: '/jobs', method: 'GET' }, { path: '/jobs', method: 'POST' }, { path: '/jobs/:id', methods: ['GET', 'PUT', 'DELETE'] }] })
})
app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true })
})
app.get('/stats', (_req: Request, res: Response) => {
  res.json({ totalJobs: jobs.length, uptime: process.uptime() })
})

app.get('/jobs', (req: Request, res: Response) => {
  const { q } = req.query
  if (q && typeof q === 'string') {
    const filtered = jobs.filter(j => j.company.toLowerCase().includes(q.toLowerCase()) || j.role.toLowerCase().includes(q.toLowerCase()))
    return res.json(filtered)
  }
  res.json(jobs)
})

app.post('/jobs', (req: Request, res: Response) => {
  const { company, role } = req.body

  if (typeof company !== 'string' || typeof role !== 'string' || !company.trim() || !role.trim()) {
    res.status(400).json({ error: 'company and role are required' })
    return
  }

  const newJob: Job = {
    id: jobs.length + 1,
    company,
    role
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
  jobs[i] = { id: jobs[i].id, company, role }
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
  res.status(500).json({ error: err.message })
})

const port = Number(process.env.PORT) || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
