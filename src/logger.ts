// Create pino logger singleton

import pino from 'pino'
import pretty from 'pino-pretty'
// import pinoPretty from 'pino-pretty';
type PinoArgs = Parameters<typeof pino>
// type pinoOptions = PinoArgs[0]

const DISABLE_LOGGING = process.env.DISABLE_LOGGING === 'true'

const pinoOptions: PinoArgs =
  process.env.NODE_ENV !== 'production'
    ? [
        {
          enabled: !DISABLE_LOGGING,
          level: 'debug',
          redact: {
            paths: ['req.headers', 'res.headers'],
            remove: true,
          }
        },
        pretty({
          colorize: true,
          ignore: 'pid,hostname,reqId',
        }),
      ]
    : [
        {
          enabled: !DISABLE_LOGGING,
          redact: {
            paths: ['req.headers', 'res.headers'],
            remove: true,
          },
          level: 'debug',
        },
      ]

const logger = pino(...pinoOptions)

export default logger
