import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

import type { Request, Response, NextFunction } from 'express'

const logMode = process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'

export const baseServer = () =>
  express()
    .use(helmet())
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(morgan(logMode))
    .use(cors({ origin: true, credentials: true }))
    .disable('x-powered-by')


export function notFoundHandler(request: Request, response: Response) {
  response.status(404).send({ error: 'Not found!', status: 404, url: request.originalUrl })
}
export function catchErrorHandler(
  error: Error & { status?: number },
  request: Request,
  response: Response,
  next: NextFunction,
) {
  console.error('ERROR', error)
  const stack = process.env.NODE_ENV !== 'production' ? error.stack : undefined
  response
    .status(Number.isInteger(error?.status) ? error.status! : 500)
    .send({ error: error.message, stack, url: request.originalUrl })
}
