import { prisma } from '../db/postgres.db.js'

export const findAllArtists = async () => {
  const response = await prisma.users.findMany({
    where: { role: { role: 'Artist' } },
    include: {
      artists: {
        select: {
          age: true,
          artist_categories: {
            select: {
              category: { select: { category_name: true } }
            }
          }
        }
      }
    }
  })


const formattedCategorArray = response.map((object) => {
  return object.artists.map((artistObject) => {
    return artistObject.artist_categories.map((categoryObject) => {
      return categoryObject.category.category_name
    })
  })
})

const formattedData = response.map((obj, idx) => {
  return {
    id: obj.id,
    name: obj.name,
    email: obj.email,
    age: obj.artists[0].age,
    categories: formattedCategorArray[idx][0]
  }
})
  return formattedData;
}

export const createVenueInDB = async (data) => {
  const { category, name, address } = data
  const ownerId = data.ownerId

  const existedVenue = await prisma.venues.findUnique({
    where: { owner_id: ownerId }
  })

  if (existedVenue) {
    return null
  }

  const newVenue = await prisma.venues.create({
    data: {
      category,
      name,
      address,
      owner_id: ownerId
    }
  })

  return newVenue
}

export const updateVenueInDB = async (data, venueId, ownerId) => {
  const venue = await prisma.venues.findUnique({
    where: { owner_id: ownerId }
  })

  if (!venue) {
    return null
  }

  const updatedVenue = await prisma.venues.update({
    where: { id: venueId },
    data: data
  })

  return updatedVenue
}

export const createEventInDB = async (data, ownerId) => {
  const venue = await prisma.venues.findUnique({
    where: { owner_id: ownerId }
  })

  if (!venue) {
    return 'Venue not found for the owner.'
  }

  const { event_name, payout, start_date_time, end_date_time, capacity, category } = data

  const venueId = venue.id
  const venueName = venue.name
  const venueType = venue.category

  const categories = await prisma.categories.findMany({
    where: {
      category_name: {
        in: category
      }
    }
  })

  const categoryIds = categories.map((c) => c.id)

  const newEvent = await prisma.events.create({
    data: {
      event_name,
      payout,
      start_date_time,
      end_date_time,
      capacity,
      venue_id: venueId
    }
  })

  await prisma.event_categories.createMany({
    data: categoryIds.map((catId) => ({
      event_id: newEvent.id,
      category_id: catId
    }))
  })

  newEvent.venueName = venueName
  newEvent.venueType = venueType
  newEvent.category = category
  return newEvent;
}

export const getAllOwnerEventsFromDB = async (ownerId) => {
  const venue = await prisma.venues.findUnique({
    where: { owner_id: parseInt(ownerId) }
  });

  if (!venue) {
    return null;
  }

  const allEvents = await prisma.events.findMany({
    where: { venue_id: venue.id },
    include: {
      event_categories: {
        select: {
          category: {
            select: {
              category_name: true
            }
          }
        }
      }
    }
  });

  const categoryArray = allEvents.map((data) => {
    return data.event_categories.map((object) => {
      return object.category.category_name;
    }) 
  });

  const formattedData = allEvents.map((event) => {
    return {
      id: event.id,
      event_name: event.event_name,
      payout: event.payout,
      start_date_time: event.start_date_time,
      end_date_time: event.end_date_time,
      capacity: event.capacity
    }
  });

  formattedData.forEach((event, index) => {
    event.categories = categoryArray[index];
  }); 


  allEvents.categories = categoryArray;
  return formattedData;
}