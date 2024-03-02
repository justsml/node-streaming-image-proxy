import ImageRouter from './imageRouter'
import { baseServer, catchErrorHandler, notFoundHandler } from './shared'

export const App = () =>
  baseServer()
    .use('/img', ImageRouter)
    .use(notFoundHandler)
    .use(catchErrorHandler)
