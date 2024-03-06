import express from 'express'
// import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import pinoHttp from 'pino-http'

import type { Request, Response, NextFunction } from 'express'
import logger from '@/logger'

// const logMode = process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'

const validImageFormats = {
  webp: 'webp',
  jpeg: 'jpeg',
  png: 'png',
  gif: 'gif',
} as const

type ImageFormats = keyof typeof validImageFormats

/**
 * Check if the image format is supported.
 */
export const isValidImageFormat = (format?: string): format is ImageFormats =>
  format != undefined && format in validImageFormats

export const baseServer = (disableLogging: boolean = false) =>
  express()
    .use(helmet())
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(disableLogging ? echoRoute : pinoHttp({ logger }))
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
export function bufferByChunk(
  stream: NodeJS.ReadableStream,
  chunkBytes = 1024 * 64,
) {
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

export function registerContainerLifeCycleEvents() {
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received.')
    process.exit(0)
  })
  process.on('SIGINT', () => {
    logger.info('SIGINT signal received.')
    process.exit(0)
  })
  process.on('uncaughtException', (error) => {
    logger.error(error, 'Uncaught Exception thrown')
    process.exit(1)
  })
  process.on('unhandledRejection', (reason, promise) => {
    logger.error({ promise, reason }, 'Unhandled Rejection at:')
    process.exit(1)
  })
}
