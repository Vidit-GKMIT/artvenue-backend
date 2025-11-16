import { prisma } from '../db/postgres.db.js'
import bcrypt from 'bcrypt'
import { createToken } from '../helpers/auth.helper.js'
import { client } from '../db/redis.db.js'

const createOwner = async (data) => {
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

const createArtist = async (data) => {
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

const verifyEmail = async (req, res) => {
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

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body
    let storedData = await client.get(email)
    if (!storedData) {
      return res.status(401).json({
        message: 'Expired OTP',
        success: false
      })
    }

    storedData = JSON.parse(storedData)
    let userData = ''

    if (otp !== storedData.otp) {
      return res.status(401).json({
        message: 'Invalid OTP',
        success: false
      })
    }

    if (storedData.role === 'Owner') {
      const ownerData = {
        name: storedData.name,
        email: storedData.email,
        password: storedData.password,
        role: storedData.role
      }
      userData = await createOwner(ownerData)
    } else {
      const artistData = {
        name: storedData.name,
        email: storedData.email,
        password: storedData.password,
        role: storedData.role,
        category: storedData.category,
        age: storedData.age
      }
      userData = await createArtist(artistData)
    }

    if (!userData) {
      return res.status(409).json({
        success: false,
        message: 'User with this username already exists'
      })
    }

    const { user, token } = userData

    return res.status(201).json({
      message: 'OTP verified successfully and user created successfully',
      success: true,
      data: user,
      token
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error.message
    })
  }
}

const loginUser = async (data) => {
  const { username, password } = data

  const user = await prisma.users.findUnique({
    where: { name: username }
  })

  if (!user) {
    return null
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return null
  }

  const roleId = user.role_id
  const roleData = await prisma.roles.findUnique({
    where: { id: roleId }
  })
  user.role = roleData.role

  const token = createToken({ id: user.id, email: user.email, role: user.role })
  return { user, token }
}

export { createOwner, createArtist, verifyEmail, verifyOTP, loginUser }
