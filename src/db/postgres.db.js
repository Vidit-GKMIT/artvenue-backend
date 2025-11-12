import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function connectPostgres() {
    try {
        await prisma.$connect()
        console.log('Postgres connected successfully')
    } catch (error) {
        console.error('Postgres connection failed:', error)
        process.exit(1) // stop the server if DB not connected
    }
}

export { connectPostgres, prisma }
