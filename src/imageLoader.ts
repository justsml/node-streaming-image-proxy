import axios from 'axios'
import type { Readable } from 'stream'

/**
 * Get a binary stream from a URL
 */
export async function getStreamInfoFromUrl(url: string) {
  const response = await axios.get<Readable>(url, {
    responseType: 'stream',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      'Content-Type': guessContentTypeFromUrl(url),
    },
  })

  return {
    stream: response.data,
    byteCount: Number(response.headers['content-length']!) || 0,
    mimeType: response.headers['content-type']! as string,
  }
}

/**
 * Guess the content type from a URL
 */
function guessContentTypeFromUrl(url: string) {
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) {
    return 'image/jpeg'
  }
  if (url.endsWith('.png')) {
    return 'image/png'
  }
  if (url.endsWith('.gif')) {
    return 'image/gif'
  }
  return 'image/jpeg'
  // application/octet-stream
}
