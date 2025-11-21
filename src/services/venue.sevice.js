import { prisma } from '../db/postgres.db.js'
export const getAllVenuesFromDB = async (userId, role) => {
  if (role === 'Owner') {
    const venues = await prisma.venues.findFirst({
      where: { owner_id: userId }
    })

    if (!venues) {
      return null
    }
    return venues
  } else if (role === 'Artist') {
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
}
