import express from 'express'
import {
  createVenue,
  updatVenue,
} from '../controllers/owner.controller.js'
import { validateVenue } from '../validators/owner.validator.js'
import { authorizeRole } from '../middlewares/verifyRole.middleware.js'

const router = express.Router()
router.use(authorizeRole('Owner'))

router.post('/', validateVenue, createVenue)
      .patch('/:venueId', validateVenue, updatVenue)


export default router

