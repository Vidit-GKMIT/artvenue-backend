import { prisma } from '../db/postgres.db.js'
import bcrypt from 'bcrypt'
import { createToken } from '../helpers/auth.helper.js'

export const createOwner = async (data) => {
  const { name, email, password, role } = data

  const existingUser = await prisma.users.findUnique({
    where: { name }
  })

  if (existingUser) {
    return null
  }

  const hashPassword = await bcrypt.hash(password, 10)
  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashPassword,
      role: {
        connect: { role }
      }
    }
  })

  const token = createToken({ id: user.id, email: user.email, role: role })
  return { user, token }
}

export const createArtist = async (data) => {
  const { name, email, password, role, category, age } = data
  const existingUser = await prisma.users.findUnique({
    where: { name }
  })

  if (existingUser) {
    return null
  }

  const hashPassword = await bcrypt.hash(password, 10)

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashPassword,
      role: {
        connect: { role }
      }
    }
  })

  const artistData = await prisma.artists.create({
    data: {
      age,
      user_id: user.id
    }
  })

  const categoryRecords = await prisma.categories.findMany({
    where: {
      category_name: { in: category } // categories array from frontend
    },
    select: { id: true }
  })

  await prisma.artist_categories.createMany({
    data: categoryRecords.map((cat) => ({
      artist_id: artistData.id,
      category_id: cat.id
    }))
  })

  const token = createToken({ id: user.id, email: user.email, role: role })
  return { user, token }
}

export const verifyEmail = async (req, res) => {
  try {
    const email = req.body.email
    const existedEmail = await prisma.users.findUnique({
      where: { email }
    })

    if (existedEmail) {
      return res
        .status(409)
        .json({ message: 'Email already exists', success: false })
    }

    return res
      .status(200)
      .json({ message: 'Email is available', success: true })
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error.message
    })
  }
}
