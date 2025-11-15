import express from 'express'
import {
  ownerRegister,
  login,
  logout,
  artistRegister
} from '../controllers/auth.controller.js'
import { verifyEmail, verifyOTP } from '../services/auth.service.js'
import { validateUser, validateLogin } from '../validators/user.validator.js'

const router = express.Router()

router
  .get('/verify-email', verifyEmail)
  .post('/registerOwner', validateUser, ownerRegister)
  .post('/registerArtist', validateUser, artistRegister)
  .post('/verify-otp', verifyOTP)
  .post('/login',validateLogin, login)
  .post('/logout', logout)

export default router
