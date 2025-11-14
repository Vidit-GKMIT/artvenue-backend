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
    subject: `${process.env.OTP_EMAIL_SUBJECT}`,
    text: `Your verification code is: ${otp}. This code will expire in 5 minutes.`,
    html: html
  })
  return info
}
