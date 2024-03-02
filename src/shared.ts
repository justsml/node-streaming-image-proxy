import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import pinoHttp from 'pino-http'

import type { Request, Response, NextFunction } from 'express'
import logger from './logger'
import { ImageFormats } from './imageResizer'

const logMode = process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'

const validImageFormats: ImageFormats[] = [
  'webp',
  'jpeg',
  'png',
  'gif',
] as const

/**
 * Check if the image format is supported.
 */
export const isValidImageFormat = (format: string): ImageFormats | undefined =>
  format in validImageFormats ? (format as ImageFormats) : undefined

export const baseServer = () =>
  express()
    .use(helmet())
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    // .use(pinoHttp({ logger }))
    // .use(morgan(logMode))
    .use(cors({ origin: true, credentials: true }))
    .disable('x-powered-by')

export function notFoundHandler(request: Request, response: Response) {
  response
    .status(404)
    .send({ error: 'Not found!', status: 404, url: request.originalUrl })
}
export function catchErrorHandler(
  error: Error & { status?: number },
  request: Request,
  response: Response,
  next: NextFunction,
) {
  logger.error(error, 'ERROR')
  const stack = process.env.NODE_ENV !== 'production' ? error.stack : undefined
  response
    .status(Number.isInteger(error?.status) ? error.status! : 500)
    .send({ error: error.message, stack, url: request.originalUrl })
}
