import express from 'express'
import {
  createEvent,
  getAllOwnerEvents
} from '../controllers/owner.controller.js'
import { validateEvent } from '../validators/owner.validator.js'
import { authorizeRole } from '../middlewares/verifyRole.middleware.js'

const router = express.Router()
router.use(authorizeRole('Owner'))

router.post('/', validateEvent, createEvent)
      .get('/events', getAllOwnerEvents)

export default router

