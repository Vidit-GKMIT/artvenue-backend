import {
  findAllVenuesFromDB,
  findAllEventsFromDB,
  sendEmail, 
  createOptInEntry,
} from '../services/artist.service.js'

export const getAllVenues = async (req, res) => {
  try {
    const allEvents = await findAllVenuesFromDB()
    if (!allEvents) {
      return res.status(404).json({
        message: 'No venues found.',
        success: false
      })
    }
    return res.status(200).json({
      message: 'All venues fetched successfully',
      data: allEvents,
      success: true
    })
  } catch (error) {
    return res.json({
      message: 'Internal server error',
      success: false,
      error: error.message
    })
  }
}

export const getAllEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const allEvents = await findAllEventsFromDB(userId)
    if (!allEvents) {
      return res.status(404).json({
        message: 'No events found',
        success: false
      })
    }

    return res.status(200).json({
      message: 'All events fetched successfully',
      data: allEvents,
      success: true
    })
  } catch (error) {
    return res.json({
      message: 'Internal server error',
      success: false,
      error: error.message
    })
  }
}

export const optInEvent = async (req, res) => {
  try {
    const artistId = req.user.id
    const { eventId } = req.params
    console.log(artistId)
    if (!eventId) {
      return res.status(400).json({
        message: 'Event ID is required',
        success: false
      })
    }

    const optInEntry = createOptInEntry(artistId, eventId);

     if(!optInEntry){
      return res.status(500).json({
        message: 'Failed to opt-in please try again later.',
        success: false
      })
     }

    const emailSent = await sendEmail(artistId, eventId)
    console.log(emailSent)

    return res.status(200).json({
        success: true,
        message: "Email have been sent to venue owner. He will connect to you soon."
    })
  } catch (error) {
    return res.json({
      message: 'Internal server error',
      success: false,
      error: error.message
    })
  }
}