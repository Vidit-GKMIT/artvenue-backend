import { createClient } from 'redis'
const client = createClient()

async function connectRedis() {
    try {
        await client.connect()
        console.log('Redis connected successfully')
    } catch (error) {
        console.error('Redis connection failed:', error)
        process.exit(1) // stop the server if DB not connected
    }
}

export { connectRedis, client }
