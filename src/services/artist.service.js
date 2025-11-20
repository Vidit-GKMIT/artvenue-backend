import { prisma } from '../db/postgres.db.js'
import { optInEmail } from './nodemailer.service.js'

export const sendEmail = async (artistId, eventId) => {
  const event = await prisma.events.findUnique({
    where: { id: parseInt(eventId) }
  })

  const venueId = event.venue_id

  const venue = await prisma.venues.findUnique({
    where: {
      id: venueId
    }
  })

  const ownerId = venue.owner_id

  const owner = await prisma.users.findUnique({
    where: { id: ownerId }
  })

  const ownerEmail = owner.email
  const ownerName = owner.name

  const artist = await prisma.users.findUnique({
    where: { id: artistId }
  })

  const artistEmail = artist.email
  const artistName = artist.name

  const info = optInEmail(
    ownerEmail,
    ownerName,
    artistEmail,
    artistName,
    event.event_name
  )
  return info
}

export const createOptInEntry = async (artistId, eventId) => {
  const artistEntry = await prisma.artists.findFirst({
    where: { user_id: artistId }
  })

  if (!artistEntry) {
    throw new Error('Artist profile not found for this user.')
  }

  const optInEntry = await prisma.opt_ins.create({
    data: {
      artist_id: artistEntry.id,
      event_id: parseInt(eventId)
    }
  })

  return optInEntry
}