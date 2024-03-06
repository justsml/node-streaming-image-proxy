import type { Readable } from 'stream'
import axios from 'axios'

/**
 * Get a binary stream from a URL, with the byte count and MIME type.
 */
export async function getStreamInfoFromUrl(url: string) {
  const response = await axios.get<Readable>(url, {
    responseType: 'stream',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
  })

  return {
    stream: response.data,
    byteCount: Number(response.headers['content-length']!) || 0,
    mimeType: response.headers['content-type']! as string,
  }
}
