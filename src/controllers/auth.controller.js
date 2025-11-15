import { userSchema, loginSchema } from '../validators/auth.validator.js'
import { loginUser } from '../services/auth.service.js'
import { generateEmailOTP } from '../helpers/auth.helper.js'
import { client } from '../db/redis.db.js'
import { sendOtpEmail } from '../services/nodemailer.service.js'

const ownerRegister = async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body, {
      abortEarly: false
    })
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Owner validation failed',
        errors: error.details.map((err) => err.message)
      })
    }

    const otp = generateEmailOTP()
    value.otp = otp
    await client.set(value.email, JSON.stringify(value), {
      EX: 60 * 5
    })

    sendOtpEmail(value.email, 5, otp, value.name)

    res.status(200).json({
      success: true,
      message: 'OTP sent to email successfully'
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
      success: false
    })
  }
}

const artistRegister = async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body, {
      abortEarly: false
    })
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Artist validation failed',
        errors: error.details.map((e) => e.message)
      })
    }

    const otp = generateEmailOTP()
    value.otp = otp
    await client.set(value.email, JSON.stringify(value), {
      EX: 60 * 5
    })

    sendOtpEmail(value.email, 5, otp, value.name)

    return res.status(200).json({
      success: true,
      message: 'OTP sent to email successfully'
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
      success: false
    })
  }
}

const login = (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false
    })
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Login validation failed',
        errors: error.details.map((err) => err.message)
      })
    }

    const isLoggedIn = loginUser(value)

    if (!isLoggedIn) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: isLoggedIn.token,
      data: isLoggedIn.user
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
      success: false
    })
  }
}

const logout = (req, res) => {
  return res
    .status(200)
    .json({ message: 'Logged Out successfully', success: true })
}

export { ownerRegister, artistRegister, login, logout }
