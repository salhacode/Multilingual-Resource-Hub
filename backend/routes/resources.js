import { Router } from 'express'

const resourcesRouter = Router()

resourcesRouter.get('/', (_request, response) => {
  response.status(501).json({
    error: 'Resources listing route is not implemented yet.',
  })
})

resourcesRouter.post('/', (_request, response) => {
  response.status(501).json({
    error: 'Resources submission route is not implemented yet.',
  })
})

export default resourcesRouter
