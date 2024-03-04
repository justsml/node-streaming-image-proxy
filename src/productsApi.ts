import { connectDb } from '@/db'

const db = connectDb()

/**
 * Products API
 *
 * This is a simple API for fetching product data.
 *
 */
export const ProductsApi = {
  /**
   * Get the photo URL for a product
   *
   * @param productId - The product ID
   * @param mediaRank - The media rank
   * @param [resize] - The resize string
   */
  getPhotoUrl({
    productId,
    mediaRank,
    resize,
  }: {
    productId: number
    mediaRank: number
    resize?: string
  }): Promise<string | undefined> {
    const row = db
      .prepare(
        'SELECT url FROM product_photos WHERE product_id = ? AND media_rank = ?',
      )
      .get(productId, mediaRank)

    const url =
      row != null && typeof row === 'object' && 'url' in row
        ? `${row.url}`
        : undefined

    return Promise.resolve(url)
  },
}
