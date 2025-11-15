import express from 'express'
import { getAllArtists, createVenue } from '../controllers/owner.controller.js'
import { validateVenue } from '../validators/owner.validator.js';


const router = express.Router()

router
  .get('/allArtists', getAllArtists)
  .post("/createVenue", validateVenue, createVenue)


export default router
