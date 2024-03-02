import { pipeline } from 'stream/promises'
import { Router } from 'express'
import { ProductsApi } from './productsApi'
import { getStreamInfoFromUrl } from './imageLoader'
import logger from './logger'
import { ImageFormats, resizeImage } from './imageResizer'
import { isValidImageFormat } from './shared'

const imagesRouter = Router().get(
  '/:id/:index/:resize?',
  (request, response, next) => {
    let { format, quality } = request.query as {
      format?: ImageFormats
      quality?: number
    }

    const { id, index, resize } = request.params

    format = isValidImageFormat(format!)

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
            changeFormat: format,
            quality,
          })

          if (byteCount > 0) response.setHeader('Content-Length', byteCount)
          response.setHeader('Content-Type', mimeType)

          return pipeline(stream, response).catch(next)
        } else {
          return next(new Error('Image not found'))
        }
      })
      .catch(next)
  },
)

const processImage = async ({
  url,
  resize,
  changeFormat,
  quality,
}: ProcessImageArgs) => {
  let { stream, byteCount, mimeType } = await getStreamInfoFromUrl(url)

  if (resize || changeFormat || quality) {
    logger.info({ resize, changeFormat, quality }, 'Resizing image')
    stream = resizeImage(stream, {
      resizeExpression: resize,
      changeFormat,
      quality,
    })
    byteCount = 0
  }

  return { stream, byteCount, mimeType }
}

type ProcessImageArgs = {
  url: string
  resize?: string
  changeFormat?: ImageFormats
  quality?: number
}

export default imagesRouter
