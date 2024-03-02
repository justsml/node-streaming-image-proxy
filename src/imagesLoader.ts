import https from 'https'
import { PassThrough } from 'stream'

/**
 * Get a binary stream from a URL
 */
export function getBinaryStreamFromUrl(url: string) {
  const passThrough = new PassThrough()
  let contentLength = 0
  let contentType: string = ''

  https
    .request(url, (res) => {
      console.log(`STATUS: ${res.statusCode}`)
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
      contentLength = Number(res.headers['content-length']!) || 0
      contentType = res.headers['content-type']!

      res
        .setEncoding('binary')
        .pipe(passThrough)
        .on('data', (chunk) => {
          console.log(`DATA: ${Buffer.byteLength(chunk)}`)
        })
        .on('end', () => {
          console.log('DONE')
        })
    })
    // .on('error', (e) => {
    //   console.error(`problem with request: ${url} ${e.message}`)
    //   passThrough.emit(
    //     'error',
    //     new Error(`problem with request: ${url} ${e.message}`),
    //   )
    // })
    // .write('')
    .end()

  return passThrough
}
