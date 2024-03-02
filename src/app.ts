import { config } from '@/config'
import ImageRouter from '@/imageRouter'
import { baseServer, catchErrorHandler, notFoundHandler } from '@/shared'

/**
 * This is where the API comes together.
 * 
 * We use the `baseServer` function to create an Express app, and then we add our routes and middleware.
 * 
 * Note: An function is used instead of an instance/singleton. This makes our server easier to test, while keeping our `.listen()` call in the entry `index.ts` file.
 */
export const App = () =>
  baseServer(config.disableLogging)
    .use('/img', ImageRouter)
    .use(notFoundHandler)
    .use(catchErrorHandler)
