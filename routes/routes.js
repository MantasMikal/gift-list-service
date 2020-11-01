
import Router from 'koa-router'

import { publicRouter } from './public.js'
import { eventRouter } from'./event.js'

const apiRouter = new Router()

const nestedRoutes = [publicRouter, eventRouter]
for (const router of nestedRoutes) apiRouter.use(router.routes(), router.allowedMethods())

export { apiRouter }
