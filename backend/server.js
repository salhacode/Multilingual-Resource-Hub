import './db/pool.js'
import express from 'express'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import apiRouter from './routes/index.js'

const app = express()
const PORT = Number(process.env.PORT) || 4000
const isProduction = process.env.NODE_ENV === 'production'
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(repoRoot, 'dist')

// In dev, Vite (:5173) and the API (:4000) are different origins. In production we serve
// both from the same origin, but leaving the headers on is harmless.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,POST,PUT,DELETE,OPTIONS',
  )
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }
  next()
})

app.use(express.json())
app.use('/api', apiRouter)

// In production, also serve the built React app from `dist/` so a single service hosts
// the frontend and backend together.
if (isProduction) {
  app.use(express.static(distDir))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    res.sendFile(join(distDir, 'index.html'))
  })
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `Server listening on http://127.0.0.1:${PORT} (mode: ${isProduction ? 'production' : 'development'})`,
  )
})
