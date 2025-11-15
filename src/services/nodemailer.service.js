import nodemailer from 'nodemailer'
import ejs from 'ejs'
import { fileURLToPath } from "url";

export const sendOtpEmail = async (
  recipientEmail,
  expirationTime,
  otp,
  userName
) => {
  const templateURL = new URL("../templates/email.template.ejs", import.meta.url);
  const templatePath = fileURLToPath(templateURL); 
  const html = await ejs.renderFile( templatePath,
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
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL}>`,
    to: recipientEmail,
    subject: 'OTP for ArtVenue',
    html: html
  })
  return info
}
