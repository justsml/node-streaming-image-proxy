import { App } from '@/app'
import logger from '@/logger'
import supertest from 'supertest'
import { describe, expect, it } from 'vitest'

logger.level = 'silent'

describe('GET /', () => {
  const app = supertest(App())

  it('should support streaming, no modification', async () => {
    const response = await app.get('/img/614/1')
    const size = Buffer.byteLength(response.body, 'binary')

    expect(size).toBe(187377)
    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toBe('image/jpeg')
    expect(response.headers['content-length']).toBe('187377')
  })

  it('should support streaming and resize', async () => {
    const response = await app.get('/img/614/1/400w')
    const size = Buffer.byteLength(response.body, 'binary')

    expect(size).toBe(18973)
    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toBe('image/jpeg')
  })

  it('should support streaming, resize, and quality', async () => {
    const response = await app.get('/img/614/4/600w?quality=75')
    const size = Buffer.byteLength(response.body, 'binary')

    expect(size).toBe(37903)
    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toBe('image/jpeg')
  })

  it('should support streaming, resize, quality, and format', async () => {
    const response = await app.get('/img/614/4/600w?quality=75&format=png')
    const size = Buffer.byteLength(response.body, 'binary')

    expect(size).toBe(129868)
    expect(response.headers['content-type']).toBe('image/png')
  })
})
