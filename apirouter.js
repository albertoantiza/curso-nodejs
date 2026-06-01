import express from 'express'

const app = express()
app.use(express.json())

const jobs = [
  { id: 1, company: 'Acme', role: 'Backend Developer' }
]

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true })
})

app.get('/jobs', (req, res) => {
  res.status(200).json(jobs)
})

app.post('/jobs', (req, res) => {
  const { company, role } = req.body

  if (!company || !role) {
    return res.status(400).json({ error: 'company and role are required' })
  }

  const newJob = {
    id: jobs.length + 1,
    company,
    role
  }

  jobs.push(newJob)

  res.status(201).json(newJob)
})

app.listen(3000, () => {
  console.log('Server is running in port 3000')
})
