import express from 'express'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import artistRouter from './routes/artist.route.js'
import venueRouter from './routes/venue.route.js'
import eventRouter from './routes/event.route.js'
import { protectedRoute } from './middlewares/auth.middleware.js'
import cors from 'cors'

const app = express()

const allowedOrigins = ["http://localhost:5174", "http://localhost:5173", "https://artvenue-frontend.vercel.app"];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRouter)

//Owner routes
app.use('/api/artists', protectedRoute, artistRouter)
app.use('/api/venues', protectedRoute, venueRouter)
app.use('/api/events', protectedRoute, eventRouter)

app.get('/', async (req, res) => {
  res.status(200).json({ message: 'Backend is running...' })
})

app.use((err, req, res, next) => {
  return res.status(500).json({
    message: 'Something went wrong!!',
    error: err.message
  })
})

//app.use('*', (req, res) => {
//   res.status(404).json({message: "not found"});
// });

export default app
