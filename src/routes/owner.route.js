import express from 'express'
import { getAllArtists, createVenue, updatVenue, createEvent } from '../controllers/owner.controller.js'
import { validateVenue, validateEvent } from '../validators/owner.validator.js';
import { authorizeRole } from '../middlewares/verifyRole.middleware.js'


const router = express.Router()
router.use(authorizeRole('Owner'));

router
  .get('/allArtists', getAllArtists)
  .post("/createVenue", validateVenue, createVenue)
  .patch("/updateVenue/:venueId", validateVenue, updatVenue)
  .post("/createEvent", validateEvent, createEvent)

export default router
