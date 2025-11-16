import express from 'express'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import ownerRouter from './routes/owner.route.js'
import { protectedRoute } from './middlewares/auth.middleware.js'
import { prisma } from './db/postgres.db.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/auth', authRouter)

//Owner routes
app.use('/api/artists', protectedRoute, ownerRouter)
app.use('/api/venues', protectedRoute, ownerRouter)
app.use('/api/venues', protectedRoute, ownerRouter)
app.use('/api/events', protectedRoute, ownerRouter)
app.use('/api/events', protectedRoute, ownerRouter)

app.get('/', async (req, res) => {
  res.status(200).json({ message: 'Backend is running...' })
})

app.use((err, req, res, next) => {
  return res.status(500).json({
    message: 'Something went wrong!!',
    err: err.message
  })
})

//app.use('*', (req, res) => {
//   res.status(404).json({message: "not found"});
// });

export default app
