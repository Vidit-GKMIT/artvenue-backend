import { generateEmailOTP } from '../helpers/auth.helper.js'
import { client } from '../db/redis.db.js'
import { sendOtpEmail } from './nodemailer.service.js'

export const sendOTPTorecipient = async (value, expirationTime) => {
  const OTP = generateEmailOTP()
  value.otp = OTP
  await client.set(value.email, JSON.stringify(value), {
    EX: 60 * 5
  })

  sendOtpEmail(value.email, expirationTime, OTP, value.name)
//   return info;
}
