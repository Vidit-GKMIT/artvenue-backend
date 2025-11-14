import { ownerSchema, artistSchema } from '../validators/auth.validator.js'
import { createOwner, createArtist } from '../services/auth.service.js'

export const ownerRegister = async (req, res) => {
  try {
    const { error, value } = ownerSchema.validate(req.body, {
      abortEarly: false
    })
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((err) => err.message)
      })
    }

    const newOwner = await createOwner(value)

    if (!newOwner) {
      return res.status(409).json({
        success: false,
        message: 'User with this username already exists'
      })
    }

    const token = newOwner.token
    const data = newOwner.user

    return res.status(201).json({
      success: true,
      message: 'Owner registered successfully',
      data,
      token
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
      success: false
    })
  }
}

export const artistRegister = async (req, res) => {
  try {
    const { error, value } = artistSchema.validate(req.body, {
      abortEarly: false
    })
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Owner validation failed',
        errors: error.details.map((e) => e.message)
      })
    }

    console.log(value)

    const newArtist = await createArtist(value)

    if (!newArtist) {
      return res.status(409).json({
        success: false,
        message: 'User with this username already exists'
      })
    }

    const token = newArtist.token
    const data = newArtist.user

    return res.status(201).json({
      success: true,
      message: 'Artist registered successfully',
      data,
      token
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
      success: false
    })
  }
}

export const login = (req, res) => {
  return res.status(200).json({ message: 'login route' })
}

export const logout = (req, res) => {
  return res.status(200).json({ message: 'logout route' })
}
