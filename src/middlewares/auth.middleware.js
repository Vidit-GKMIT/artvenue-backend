import jwt from 'jsonwebtoken'
const protectedRoute = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token is not correct...' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Unauthorized', error: error.message })
  }
}

export { protectedRoute }
