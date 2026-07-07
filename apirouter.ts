import express, { type Request, type Response } from 'express'

interface Job {
  id: number
  company: string
  role: string
}

const app = express()
app.use(express.json())

const jobs: Job[] = [
  { id: 1, company: 'Acme', role: 'Backend Developer' }
]

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ ok: true })
})

app.get('/jobs', (_req: Request, res: Response) => {
  res.status(200).json(jobs)
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

const port = Number(process.env.PORT) || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
