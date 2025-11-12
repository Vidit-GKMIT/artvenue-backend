import express from 'express'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/auth', authRouter)

app.get('/', async (req, res) => {
    console.log('Bakcend Working...!!')
})

app.use((err, req, res) => {
    return res.status(500).json({
        message: 'Something went wrong!!',
        err: err.message,
    })
})

//app.use('*', (req, res) => {
//   res.status(404).json({message: "not found"});
// });

export default app
