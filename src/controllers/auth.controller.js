import { sendOTPTorecipient } from '../services/sendOtp.service.js'
import { loginUser } from '../services/auth.service.js'
import { checkExistingUser } from '../services/auth.service.js'

const ownerRegister = async (req, res) => {
  try {
    const value = req.validatedData
    const existingUser = await checkExistingUser(value);
    if(existingUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false
      })
    }
    sendOTPTorecipient(value, 5)

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
    const value = req.validatedData
    const existingUser = await checkExistingUser(value);
    if(existingUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false
      })
    }
    sendOTPTorecipient(value, 5)

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

const login = async (req, res) => {
  try {
    const value = req.validatedData
    const isLoggedIn = await loginUser(value)

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
