import express from 'express'
import {
  getAllArtists,
} from '../controllers/owner.controller.js'
import { authorizeRole } from '../middlewares/verifyRole.middleware.js'

const router = express.Router()

router.get('/', authorizeRole('Owner'), getAllArtists) // for venue owner to see all artists
export default router 


