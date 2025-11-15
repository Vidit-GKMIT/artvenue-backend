import express from 'express'
import {
  ownerRegister,
  login,
  logout,
  artistRegister
} from '../controllers/auth.controller.js'
import { verifyEmail, verifyOTP } from '../services/auth.service.js'

const router = express.Router()

router
  .get('/verify-email', verifyEmail)
  .post('/registerOwner', ownerRegister)
  .post('/registerArtist', artistRegister)
  .post('/verify-otp', verifyOTP)
  .post('/login', login)
  .post('/logout', logout)

export default router
