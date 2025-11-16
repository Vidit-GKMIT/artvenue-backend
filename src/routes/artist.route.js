import express from 'express'
import {
  getAllArtists,
} from '../controllers/owner.controller.js'
import { authorizeRole } from '../middlewares/verifyRole.middleware.js'

const router = express.Router()
router.use(authorizeRole('Owner'))

router.get('/', getAllArtists)
export default router 


