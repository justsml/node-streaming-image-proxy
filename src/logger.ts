// Create pino logger singleton

import pino from 'pino'
import pretty from 'pino-pretty'
// import pinoPretty from 'pino-pretty';
type PinoArgs = Parameters<typeof pino>
// type pinoOptions = PinoArgs[0]

const pinoOptions: PinoArgs =
  process.env.NODE_ENV === 'development'
    ? [
        {
          level: 'debug',
        },
        pretty({
          colorize: true,
          ignore: 'pid,hostname,reqId',
        }),
      ]
    : [
        {
          redact: ['req.headers.authorization'],
          level: 'debug',
        },
      ]

const logger = pino(...pinoOptions)

export default logger
