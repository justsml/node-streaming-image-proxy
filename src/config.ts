import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: Number(process.env.PORT || 3000),
  dbUrl: process.env.DB_URL || ':memory:',
  logLevel: process.env.LOG_LEVEL || 'info',
  disableLogging: process.env.DISABLE_LOGGING === 'true',
}
