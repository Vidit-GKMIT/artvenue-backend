import express from 'express'
import {
  getAllArtists,
  createVenue,
  updatVenue,
  createEvent,
  getAllOwnerEvents
} from '../controllers/owner.controller.js'
import { validateVenue, validateEvent } from '../validators/owner.validator.js'
import { authorizeRole } from '../middlewares/verifyRole.middleware.js'

const router = express.Router()
router.use(authorizeRole('Owner'))

router
  .get('/', getAllArtists)
  .post('/', validateVenue, createVenue)
  .patch('/:venueId', validateVenue, updatVenue)
  .post('/', validateEvent, createEvent)
  .get('/:ownerId', getAllOwnerEvents)

export default router
