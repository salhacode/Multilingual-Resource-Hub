import express from 'express'

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    status: 'ok',
    message: 'Backend is running',
  })
})

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
