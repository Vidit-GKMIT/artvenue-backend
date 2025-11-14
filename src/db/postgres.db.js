import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function connectPostgres() {
  const userName = process.env.DB_USERNAME
  const password = process.env.DB_PASSWORD
  const host = process.env.DB_HOST
  const schema = process.env.DB_SCHEMA
  const database = process.env.DATABASE

  process.env.DATABASE_URL = `postgresql://${userName}:${password}@${host}/${database}?schema=${schema}`
  try {
    await prisma.$connect()
    console.log('Postgres connected successfully')
  } catch (error) {
    console.error('Postgres connection failed:', error)
    process.exit(1) // stop the server if DB not connected
  }
}

export { connectPostgres, prisma }
