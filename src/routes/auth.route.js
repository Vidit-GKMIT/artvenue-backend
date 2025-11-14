import express from 'express'
import { ownerRegister, login, logout, artistRegister } from '../controllers/auth.controller.js'
import { verifyEmail } from '../services/verifyEmail.service.js'

const router = express.Router()

router.get('/verify-email', verifyEmail)
router.post('/registerOwner', ownerRegister)
router.post('/registerArtist', artistRegister)
router.post('/login', login)
router.post('/logout', logout)

export default router
