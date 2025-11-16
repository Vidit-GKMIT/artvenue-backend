import Joi from 'joi'

export const validateVenue = (req, res, next) => {
  const venueSchema = Joi.object({
    category: Joi.string()
      .valid('Hotel', 'Bar', 'Restaurant', 'Club')
      .default('Restaurant')
      .messages({
        'any.only': 'Category must be one of: Hotel, Bar, Restaurant, Club'
      }),

    name: Joi.string().max(30).required().messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name cannot be empty',
      'any.required': 'Name is required'
    }),

    address: Joi.string().required().messages({
      'string.base': 'Address must be a string',
      'string.empty': 'Address cannot be empty',
      'any.required': 'Address is required'
    })
  })

  const { error, value } = venueSchema.validate(req.body, {
    abortEarly: false
  })

  if (error) {
    throw new Error(error.details.map((err) => err.message))
  }

  req.validatedData = value
  next()
}

export const validateEvent = (req, res, next) => {
  const createEventSchema = Joi.object({
    event_name: Joi.string().max(30).required().messages({
      'string.empty': 'Event name cannot be empty',
      'string.max': 'Event name must not exceed 30 characters',
      'any.required': 'Event name is required'
    }),

    payout: Joi.number().integer().required().messages({
      'number.base': 'Payout must be a number',
      'any.required': 'Payout is required'
    }),

    start_date_time: Joi.date().iso().required().messages({
      'date.base': 'Start date must be a valid date',
      'date.format': 'Start date must be in ISO format',
      'any.required': 'Start date is required'
    }),

    end_date_time: Joi.date()
      .iso()
      .greater(Joi.ref('start_date_time'))
      .required()
      .messages({
        'date.base': 'End date must be a valid date',
        'date.format': 'End date must be in ISO format',
        'date.greater': 'End date cannot be before start date',
        'any.required': 'End date is required'
      }),

    capacity: Joi.number().integer().required().messages({
      'number.base': 'Capacity must be a number',
      'any.required': 'Capacity is required'
    }),

    category: Joi.array()
      .items(
        Joi.string().messages({
          'string.base': 'Category must be a string'
        })
      )
      .required()
      .messages({
        'any.required': 'Categories are required'
      })
  })

  const { error, value } = createEventSchema.validate(req.body)

  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map((err) => err.message),
      success: false
    })
  }
  req.validatedData = value
  next()
}
