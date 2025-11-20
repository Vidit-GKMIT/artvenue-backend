import express from 'express'
import {
  createVenue,
  updateVenue,
} from '../controllers/owner.controller.js'
import { validateVenue } from '../validators/owner.validator.js'
import { authorizeRole } from '../middlewares/verifyRole.middleware.js'
import { getAllVenues } from '../controllers/artist.controller.js'
import { getVenueForParticularOwner } from '../controllers/owner.controller.js'

const router = express.Router()

//for owners
router.post('/',[authorizeRole('Owner'), validateVenue],  createVenue)  //create venue
      .patch('/:venueId',[authorizeRole('Owner'), validateVenue], updateVenue) //update venue 
      .get('/owner-venue',authorizeRole('Owner'), getVenueForParticularOwner) //get venue of an owner 
    
//for artists
router.get('/',authorizeRole('Artist'), getAllVenues)


export default router
