import express from 'express'
import apiRouter from './routes/index.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use('/api', apiRouter)

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
