import os from 'os'
import sharp, { Sharp } from 'sharp'
import logger from './logger'
import type { Readable } from 'stream'

export type ImageFormats = 'webp' | 'jpeg' | 'png' | 'gif'

type ResizeArgs = Parameters<Sharp['resize']>[0]
type ResizeImageOptions = {
  format?: ImageFormats
  quality?: number
  resizeExpression?: string
  sharpOptions?: ResizeArgs
}

// Apply performance tuning options
enhancifySystem()

/**
 * ## Streaming image resizer ✨
 *
 * **Note:** Whenever you change the bytes of the image, you SHOULD ideally also change the Content-Length header. If it's not possible, you can remove the Content-Length header to let the client know that the length is unknown. This can cause issues with some clients, so it's not recommended.
 *
 * @param stream - The image stream
 * @param [format] - The format to change to
 * @param [quality=80] - The quality of the image
 * @param [resizeExpression] - The resize expression
 * @param [sharpOptions] - The sharp.resize() options
 */
export function resizeImage(
  stream: Readable,
  {
    format,
    quality = 80,
    resizeExpression,
    sharpOptions = { fit: 'cover' },
  }: ResizeImageOptions = {
    format: undefined,
    quality: 80,
    resizeExpression: undefined,
    sharpOptions: { fit: 'cover' },
  },
) {
  if (!resizeExpression) return stream

  quality = Math.max(1, Math.min(Number(quality), 100))

  let transformer = sharp().resize({
    ..._translateResizeExpression(resizeExpression),
    ...(sharpOptions || {}),
    withoutEnlargement: true,
  })

  if (format) transformer = transformer[format]({ quality })

  return stream.pipe(transformer)
}

export function _translateResizeExpression(expression: string): ResizeArgs {
  const numberPairPattern = /^(\d+%?)[x:\/](\d+%?)$/gim
  const heightPattern = /^(\d+%*)h$|^h(\d+%*)$/gim
  const widthPattern = /^(\d+%*)w?$|^w(\d+%*)$/gim

  if (numberPairPattern.test(expression)) {
    const [_, width, height] = expression.split(numberPairPattern)

    return {
      width: validateResizeDimension(width),
      height: validateResizeDimension(height),
    }
  }

  if (widthPattern.test(expression)) {
    const [_, width] = expression.split(widthPattern)
    return { width: validateResizeDimension(width) }
  }
  if (heightPattern.test(expression)) {
    const [_, height] = expression.split(heightPattern)
    return { height: validateResizeDimension(height) }
  }
  return {}
}

/** Convert string 'null' into undefined - to comply with types */
function validateResizeDimension(value: string) {
  return value === 'null'
    ? undefined
    : // : value.endsWith('%')
      // ? `${value}%`
      Number(value)
}

process.env.UV_THREADPOOL_SIZE = '64'
/**
 * Applies non-default tuning options for sharp & libuv.
 */
function enhancifySystem() {
  // TODO: increase the concurrency value & test to find the best performance for your environment.
  const cpuCount = os.cpus().length
  const concurrency = Math.max(1, cpuCount - 1)
  logger.warn('Enabling Performance Mode! Concurrency set to %d', concurrency)

  sharp.concurrency(Math.max(1, cpuCount - 1))
  sharp.simd(true)
  sharp.cache(false) // Set `false` on VPS/Lambda environments, `true` on 64GB+ dedicated servers.
}
