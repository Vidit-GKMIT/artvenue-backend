import Joi from 'joi'

const userSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'any.required': 'Name is required'
  }),

  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is required',
    'string.email': 'Please enter a valid email address'
  }),

  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required'
  }),

  role: Joi.string().required().messages({
    'string.base': 'Role must be a string',
    'string.empty': 'Role cannot be empty',
    'any.required': 'Role is required'
  }),

  age: Joi.alternatives().conditional('role', {
    is: 'Artist',
    then: Joi.number().integer().min(18).required().messages({
      'number.base': 'Age must be a number',
      'number.integer': 'Age must be an integer',
      'number.min': 'Age must be at least 18',
      'any.required': 'Age is required'
    }),
    otherwise: Joi.forbidden()
  }),

  category: Joi.alternatives().conditional('role', {
    is: 'Artist',
    then: Joi.array()
      .items(
        Joi.string().trim().min(1).messages({
          'string.base': 'Category must be a string',
          'string.empty': 'Category cannot be empty'
        })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one category is required',
        'any.required': 'Categories are required'
      }),
    otherwise: Joi.forbidden()
  })
})

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username cannot be empty',
    'any.required': 'Username is required'
  }),

  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required'
  })
})

export { userSchema, loginSchema }
