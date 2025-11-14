import { prisma } from '../db/postgres.db.js'
import bcrypt from 'bcrypt'
import { createToken } from '../helpers/auth.helper.js'

export const create = async (ownerData) => {
  const { name, email, password, role } = ownerData
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
});

  const token = createToken({ id: user.id, email: user.email, role: role })
  return { user, token }
}
