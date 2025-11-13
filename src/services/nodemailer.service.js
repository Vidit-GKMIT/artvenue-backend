import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'khandelwal7vidit@gmail.com',
//     pass: 'dozs zwmy hczr xmhn', // App password from Google
//   },
// });

// export const sendOtpEmail = async (recipientEmail,expirationTime, otp, userName) => {
//   const info = await transporter.sendMail({
//     from: '"Art Venue" <khandelwal7vidit@gmail.com>',
//     to: recipientEmail,
//     subject: "OTP For Signin in ArtVenue",
//     text: `Hello ${userName},\n\nYour OTP for signing in to ArtVenue is: ${otp}\nThis OTP is valid for ${expirationTime} minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nArtVenue Team`,
//     html: `Hello ${userName},\n\nYour OTP for signing in to ArtVenue is: ${otp}\nThis OTP is valid for ${expirationTime} minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nArtVenue Team`,
//   });
//   console.log("Message sent:", info.messageId);
//   return info;
// }



export const sendOtpEmail = async (recipientEmail,expirationTime, otp, userName) => {
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'mireya.runte@ethereal.email',
        pass: 'VNyZ1cT3rkCkhPmcx2'
    }
});

  let info = await transporter.sendMail({
    from: '"ArtVenue " <artvenue@gmail.com>',
    to: recipientEmail,
    subject: "Hello ✔",
    text: "Hello world?", // plain‑text body
    html: "<b>Hello world?</b>", // HTML body
    })
    console.log(info);
  console.log("Message sent:", info.messageId);
  return info;
}
