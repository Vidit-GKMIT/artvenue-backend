import express from 'express'
import { createVenue, updateVenue } from '../controllers/owner.controller.js'
import { validateVenue } from '../validators/owner.validator.js'
import { authorizeRole } from '../middlewares/verifyRole.middleware.js'
import { getAllVenues } from '../controllers/venue.controller.js'

const router = express.Router()

//for owners
router
  .post('/', [authorizeRole('Owner'), validateVenue], createVenue) //create venue
  .patch('/:venueId', [authorizeRole('Owner'), validateVenue], updateVenue) //update venue

router.get('/', getAllVenues) // for both owners and artists to get all venues

export default router
