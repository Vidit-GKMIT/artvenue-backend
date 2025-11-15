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
