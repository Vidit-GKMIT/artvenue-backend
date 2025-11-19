import express from 'express'
import {
  createEvent,
  getAllOwnerEvents
} from '../controllers/owner.controller.js'
import { validateEvent } from '../validators/owner.validator.js'
import { authorizeRole } from '../middlewares/verifyRole.middleware.js'
import { getAllEvents, optInEvent } from '../controllers/artist.controller.js'

const router = express.Router()

// for owner
router.post('/',[authorizeRole('Owner'), validateEvent], createEvent) // create event
      .get('/',authorizeRole('Owner'), getAllOwnerEvents) // get all events for your venue

// for artist      
router.get('/artist', authorizeRole('Artist'),  getAllEvents)     // artist to see all events
      .post('/artist/:eventId', authorizeRole('Artist'),  optInEvent)  // artist to opt in for event
export default router

