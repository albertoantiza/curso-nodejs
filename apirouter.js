import express from 'express'

const app = express()
app.use(express.json())

const jobs = [
  { id: 1, company: 'Acme', role: 'Backend Developer' }
]

