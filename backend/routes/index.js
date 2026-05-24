import { Router } from 'express'
import healthRouter from './health.js'
import resourcesRouter from './resources.js'

const apiRouter = Router()

apiRouter.use('/health', healthRouter)
apiRouter.use('/resources', resourcesRouter)

export default apiRouter
