import express from 'express'
// import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import pinoHttp from 'pino-http'

import type { Request, Response, NextFunction } from 'express'
import logger from '@/logger'
import { ImageFormats } from '@/imageResizer'

// const logMode = process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'

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
  // @ts-expect-error
  validImageFormats.includes(format) ? (format as ImageFormats) : undefined

export const baseServer = (disableLogging: boolean = false) =>
  express()
    .use(helmet())
    .use(express.json())
    .use(express.urlencoded({ extended: false }))

    .use(disableLogging ? echoRoute : pinoHttp({ logger }))
    // .use(morgan(logMode))
    .use(cors({ origin: true, credentials: true }))
    .disable('x-powered-by')

export const echoRoute = (
  _request: Request,
  _response: Response,
  next: NextFunction,
) => next()

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

/** Buffers a stream to buffer an input `stream` by `chunkBytes`  */
export function bufferByChunk(stream: NodeJS.ReadableStream, chunkBytes = 1024 * 64) {
  const { PassThrough } = require('stream')
  const pass = new PassThrough()
  let buffer = Buffer.from('')
  stream.on('data', (chunk) => {
    const size = Buffer.byteLength(chunk)
    if (size > chunkBytes) {
      // Note: should be a rare case
      // resize the chunk size up to at-least the size of the chunk
      chunkBytes = size
      pass.write(chunk)
      return
    }
    buffer = Buffer.concat([buffer, chunk])
    if (buffer.length >= chunkBytes) {
      pass.write(buffer)
      buffer = Buffer.from('')
    }
  })
  stream.on('end', () => {
    pass.end(buffer)
  })
  return pass
}