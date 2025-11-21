import {
  sendEmail, 
  createOptInEntry,
} from '../services/artist.service.js'

export const optInEvent = async (req, res) => {
  try {
    const artistId = req.user.id
    const { eventId } = req.params
    if (!eventId) {
      return res.status(400).json({
        message: 'Event ID is required',
        success: false
      })
    }

    const optInEntry = await createOptInEntry(artistId, eventId);

     if(!optInEntry){
      return res.status(500).json({
        message: 'Failed to opt-in please try again later.',
        success: false
      })
     }

    const emailSent = sendEmail(artistId, eventId)

    return res.status(200).json({
        success: true,
        message: "Email have been sent to venue owner. He will connect to you soon."
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error.message
    })
  }
}