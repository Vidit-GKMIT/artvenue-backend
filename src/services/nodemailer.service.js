import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path'

export const sendOtpEmail = async (
  recipientEmail,
  expirationTime,
  otp,
  userName
) => {
  const html = await ejs.renderFile(
    path.join(__dirname, 'templates', 'email.template.ejs'),
    { otp, userName, expiryMinutes: expirationTime }
  )
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD // App password from Google
    }
  })

  let info = await transporter.sendMail({
    from: '"ArtVenue" <artvenue@gmail.com>',
    to: recipientEmail,
    subject: 'OTP for ArtVenue',
    text: `Your verification code is: ${otp}. This code will expire in 5 minutes.`,
    html: html
  })
  console.log('Message sent:', info.messageId)
  return info
}
