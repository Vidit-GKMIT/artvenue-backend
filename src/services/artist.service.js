import { prisma } from '../db/postgres.db.js'
import { formatIST } from '../helpers/date.helper.js'
import { optInEmail } from './nodemailer.service.js'

export const findAllVenuesFromDB = async () => {
  const allEvents = await prisma.venues.findMany({
    select: {
      id: true,
      category: true,
      name: true,
      address: true
    }
  })

  return allEvents
}

export const findAllEventsFromDB = async (userId) => {
  const now = new Date()
  const fiveThirtyHoursInMilliseconds = (5 * 60 + 30) * 60 * 1000

  const futureOffsetTime = new Date(
    now.getTime() + fiveThirtyHoursInMilliseconds
  )

  const allEvents = await prisma.events.findMany({
    where: {
      end_date_time: {
        gt: futureOffsetTime
      }
    },
    select: {
      id: true,
      event_name: true,
      payout: true,
      start_date_time: true,
      end_date_time: true,
      capacity: true,
      venue: {
        select: {
          category: true,
          name: true,
          address: true
        }
      }
    }
  })

  const artist = await prisma.artists.findMany({
    where: {
      user_id: userId
    }
  })

  const artistId = artist.id

  const optedInEvents = await prisma.opt_ins.findMany({
    where: {
      artist_id: artistId
    }
  });

  const optInEventsArray = optedInEvents.map((obj) => {
    return obj.event_id;
  })

  const formatted = allEvents.map((e) => ({
    id: e.id,
    event_name: e.event_name,
    payout: e.payout,
    start: formatIST(e.start_date_time),
    end: formatIST(e.end_date_time),
    capacity: e.capacity,
    venue: e.venue,
    optedIn: optInEventsArray.includes(e.id) ? "Yes" : "No"
  }))

  return formatted
}

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

  const info = await optInEmail(
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