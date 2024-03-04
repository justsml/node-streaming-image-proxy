import { App } from '@/app'

const port = parseInt(process.env.PORT || '3000')
const startMessage = `Started server on http://0.0.0.0:${port}`

App()
  .listen(port)
  .on('error', console.error)
  .on('listening', () => console.log(startMessage))
