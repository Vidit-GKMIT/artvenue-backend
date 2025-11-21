import { prisma } from '../db/postgres.db.js'
import { formatIST } from '../helpers/date.helper.js'

export const getAllEventsFromDB = async (userId, role) => {
  if (role === 'Artist') {
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


    const artistId = artist[0].id


    const optedInEvents = await prisma.opt_ins.findMany({
      where: {
        artist_id: artistId
      }
    })

    const optInEventsArray = optedInEvents.map((obj) => {
      return obj.event_id
    })

    const formatted = allEvents.map((e) => ({
      id: e.id,
      event_name: e.event_name,
      payout: e.payout,
      start: formatIST(e.start_date_time),
      end: formatIST(e.end_date_time),
      capacity: e.capacity,
      venue: e.venue,
      optedIn: optInEventsArray.includes(e.id) ? 'Yes' : 'No'
    }))

    return formatted
  } else if (role === 'Owner') {
    const venue = await prisma.venues.findUnique({
    where: { owner_id: userId }
  });

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

  for (let key in formattedData ) {
    formattedData[key].start_date_time = formatIST(formattedData[key].start_date_time);
    formattedData[key].end_date_time = formatIST(formattedData[key].end_date_time);
  }
  return formattedData;
  }
}
