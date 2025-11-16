import jwt from 'jsonwebtoken'

const createToken = (data) => {
  const token = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY
  })
  return token
}

const generateEmailOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export { createToken, generateEmailOTP }
