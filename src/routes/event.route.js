import express from 'express'
import { createEvent } from '../controllers/owner.controller.js'
import { validateEvent } from '../validators/owner.validator.js'
import { authorizeRole } from '../middlewares/verifyRole.middleware.js'
import { optInEvent } from '../controllers/artist.controller.js'
import { getAllEvents } from '../controllers/event.controller.js'

const router = express.Router()

// for owner
router.post('/', [authorizeRole('Owner'), validateEvent], createEvent) // create event
router.get('/', getAllEvents) // for both owners and artists

router.post('/opt-in/:eventId', authorizeRole('Artist'), optInEvent) // artist to opt in for event
export default router
