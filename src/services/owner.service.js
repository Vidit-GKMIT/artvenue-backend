import { prisma } from '../db/postgres.db.js'

export const findAllArtists = async () => {
  const artists = await prisma.users.findMany({
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

  const formatted = artists.map((a) => {
    const artist = a.artists[0]

    return {
      id: a.id,
      name: a.name,
      email: a.email,
      age: artist.age,
      categories: artist.artist_categories.map((c) => c.category.category_name)
    }
  })

  console.log(formatted)

  return formatted
}

export const createVenueInDB = async (data) => {
  const { category, name, address } = data
  const ownerId = data.ownerId;

  const existedVenue = await prisma.venues.findUnique({
      where: { owner_id: ownerId },
    });


    if (existedVenue) {
        return null;
    }

    const newVenue = await prisma.venues.create({
      data: {
        category,
        name,
        address,
        owner_id: ownerId,
      },
    });

    return newVenue;
}

export const updateVenueInDB = async (venueId, data, ownerId) => {
  const venue = await prisma.venues.findUnique({
    where: { owner_id: ownerId},
  });

  if(!venue){
    return null;
  }

  const updatedVenue = await prisma.venues.update({
    where: { id: parseInt(venueId) },
    data: data,
  });

  return updatedVenue;
}
