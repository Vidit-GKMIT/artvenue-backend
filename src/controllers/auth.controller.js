import { ownerRegisterSchema } from '../validators/auth.validator.js'
import { create } from '../services/auth.service.js'

export const ownerRegister = async (req, res) => {
  try {
    const { error, value } = ownerRegisterSchema.validate(req.body, {
      abortEarly: false
    })
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((err) => err.message)
      })
    }

    const newOwner = await create(value)
    const token = newOwner.token
    const data = newOwner.user

    return res.status(201).json({
      success: true,
      message: 'Owner registered successfully',
      data,
      token
    })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const artistRegister = (req, res) => {
  return res.status(200).json({ message: 'artist register route' })
}

export const login = (req, res) => {
  return res.status(200).json({ message: 'login route' })
}

export const logout = (req, res) => {
  return res.status(200).json({ message: 'logout route' })
}
