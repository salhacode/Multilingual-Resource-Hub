import { Router } from 'express'

const healthRouter = Router()

healthRouter.get('/', (_request, response) => {
  response.status(200).json({
    status: 'ok',
    message: 'Backend is running',
  })
})

export default healthRouter
