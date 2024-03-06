import { getStreamInfoFromUrl } from '@/imageLoader'
import { resizeImage } from '@/imageResizer'
import logger from '@/logger'
import { ProductsApi } from '@/productsApi'
import { isValidImageFormat } from '@/shared'
import { Router } from 'express'
import { pipeline } from 'stream/promises'

const imagesRouter = Router().get(
  '/:id/:index/:resize?',
  (request, response, next) => {
    const q = request.query

    const { id, index, resize } = request.params

    const format =
      typeof q.format === 'string' && isValidImageFormat(`${q.format}`)
        ? q.format
        : undefined
    const quality =
      typeof q.quality === 'string'
        ? Math.max(10, Math.min(Number(q.quality), 100))
        : 80

    logger.debug(
      'Loading id: %d, index: %d, resize: %s, format: %s',
      id,
      index,
      resize,
      format,
    )

    response.setHeader('Cache-Control', 'no-cache').setHeader('Expires', '0')

    return ProductsApi.getPhotoUrl({
      productId: Number(id),
      mediaRank: Number(index),
    })
      .then(async (url) => {
        logger.debug({ id, index }, 'Loading.URL %s', url)
        if (url) {
          // Load the image stream, size & format
          const { stream, byteCount, mimeType } = await processImage({
            url,
            resize,
            format,
            quality,
          })

          if (byteCount > 0) response.setHeader('Content-Length', byteCount)
          response.setHeader('Content-Type', mimeType)

          return pipeline(stream, response).catch(next)
        }
        return next(new Error('Image not found'))
      })
      .catch(next)
  },
)

const processImage = async ({
  url,
  resize,
  format,
  quality,
}: Record<string, string | number | undefined>) => {
  if (!url || typeof url !== 'string') throw new Error('Invalid URL')
  let { stream, byteCount, mimeType } = await getStreamInfoFromUrl(url)

  if (resize || format || quality) {
    resize = resize != null ? `${resize}` : undefined
    format = format != null ? `${format}` : undefined
    quality = quality != null ? Number(quality) : undefined

    if (format) mimeType = `image/${format}`
    byteCount = 0

    logger.debug(
      { resize, format, quality, originalBytes: byteCount },
      'Resizing image',
    )
    stream = resizeImage(stream, {
      resizeExpression: resize,
      format,
      quality,
    })
  }

  return { stream, byteCount, mimeType }
}

export default imagesRouter
