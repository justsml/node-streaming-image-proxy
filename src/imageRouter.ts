import { pipeline } from 'stream/promises'
import { Router } from 'express'
import { ProductsApi } from './productsApi'
import { getStreamInfoFromUrl } from './imageLoader'
import logger from './logger'

const imagesRouter = Router().get(
  '/:id/:index/:resize?',
  (request, response, next) => {
    const { id, index } = request.params
    console.debug('Loading id: %d, index: %d', id, index)

    response
      .setHeader('Content-Type', 'image/jpeg')
      .setHeader('Cache-Control', 'no-cache')
      .setHeader('Expires', '0')

    return ProductsApi.getPhotoUrl({
      productId: Number(id),
      mediaRank: Number(index),
    }).then(async (url) => {
      logger.debug('Loading.URL %s', url)
      if (url) {
        const { stream, contentLength, contentType } =
          await getStreamInfoFromUrl(url)
        response.setHeader('Content-Length', contentLength)
        response.setHeader('Content-Type', contentType)
        return pipeline(stream, response).catch((error) => {
          console.error('Pipeline error', error)
          return next(error)
        })
      } else {
        return next(new Error('Image not found'))
      }
    })
    .catch(next)
  },
)

export default imagesRouter
