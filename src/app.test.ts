import { describe, it, expect } from 'vitest'
import supertest from 'supertest'
import {App} from '@/app'
import logger from '@/logger'

logger.level = 'silent'

describe('GET /', () => {
  it('should return 200', async () => {
    const response = await supertest(App()).get('/img/614/1')
    expect(response.status).toBe(200)
  })
})
