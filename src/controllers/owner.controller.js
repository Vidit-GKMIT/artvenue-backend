import { findAllArtists, createVenueInDB, updateVenueInDB, createEventInDB } from '../services/owner.service.js'

export const getAllArtists = async (req, res) => {
  try {
    const allArtists = await findAllArtists()
    return res.status(200).json({
      message: 'All artists fetched successfully',
      data: allArtists,
      success: true
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error.message
    })
  }
}

export const createVenue = async (req, res) => {
  try {
    const data = req.validatedData
    data.ownerId = req.user.id;
    const createdVenue = await createVenueInDB(data)

    if (!createdVenue) {
      return res.status(400).json({
        message:
          'Venue already exists for this owner and one owner can have only one venue.',
        success: false
      })
    }

    res.status(201).json({
      message: 'Venue created successfully.',
      data: createdVenue,
      success: true
    })
  } catch (error) {
    console.error('Error creating venue:', error)
    res.status(500).json({ message: 'Internal server error.', success: false,  error: error.message })
  }
}

export const updatVenue = async (req,res) => {
  try {
    const data = req.validatedData;
    const updateVenueData = await updateVenueInDB(req.params.venueId, data, req.user.id);

    if (!updateVenueData) {
      return res.status(403).json({
        message: 'You are not authorized to update this venue.',
        success: false
      });
    }

    return res.status(200).json({
      message: 'Venue updated successfully.',
      data: updateVenueData,
      success: true
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', success: false,  error: error.message })
  }
}

export const createEvent = async (req, res) => {
  const data = req.validatedData;
  const createdEvent = await createEventInDB(data, req.user.id);

  if(createdEvent === 'Venue not found for the owner.') {
    return res.status(404).json({
      message: 'Venue not found for the owner. Please create a venue first.',
      success: false
    });
  }

  return res.status(201).json({
    message: 'Event created successfully.',
    data: createdEvent,
    success: true
  });
}