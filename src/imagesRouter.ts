import express from 'express'
import { ProductsApi } from './productsApi'
import { getBinaryStreamFromUrl } from './imagesLoader'

const imagesRouter = express.Router()

imagesRouter.get('/:id/:index', (request, response, next) => {
  const { id, index } = request.params

  response
    .setHeader('Content-Type', 'image/jpeg')
    .setHeader('Cache-Control', 'no-cache')
    .setHeader('Expires', '0')

  ProductsApi.getPhotoUrl({
    productId: Number(id),
    mediaRank: Number(index),
  }).then((url) => {
    if (url) {
      getBinaryStreamFromUrl(url)
        .on('error', (error) => {
          console.error('ERROR', error)
          response.status(500).send({ error: error.message })
        })
        .pipe(response)
      // response.redirect(url)
    } else {
      return next(new Error('Image not found'))
    }
  })
})

export default imagesRouter

// - `/img/:product_id/:rank`
// - `/img/:product_id/:rank/:resize`
