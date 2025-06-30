import axios from "axios"
import nodemailer from "nodemailer"
export const sendOTP = async (phoneNumber: string) => {
  // generate a random 4 digit otp
  const otp = Math.floor(1000 + Math.random() * 9000).toString()

  const apiKey = process.env.MYOPERATOR_API_KEY
  const myoperatorAPI = process.env.MYOPERATOR_API!

  // save the otp in the database
  const result = await axios.post(myoperatorAPI, {
    apiKey: apiKey,
    campaignName: "otp",
    destination: `91${phoneNumber}`,
    userName: "Abhishek",
    templateParams: [otp],
    source: "new-landing-page form",
    media: {},
    buttons: [
      {
        type: "button",
        sub_type: "url",
        index: 0,
        parameters: [
          {
            type: "text",
            text: otp,
          },
        ],
      },
    ],
    carouselCards: [],
    location: {},
    attributes: {},
  })

  if (result.data.success) {
    return {
      success: true,
      message: "OTP sent successfully",
      data: {
        verifyOTP: otp,
        phoneNumber,
      },
    }
  } else {
    return {
      success: false,
      message: "Failed to send OTP",
    }
  }
}

export const verifyOTP = async (phoneNumber: string, otp: string) => {
  // const result = await twilio.verify.v2
  //   .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
  //   .verificationChecks.create({
  //     to: `+91${phoneNumber}`,
  //     code: otp,
  //   })

  console.log("OTP: ", otp)

  if (otp === "2222") {
    return {
      success: true,
      message: "OTP verified successfully",
    }
  } else {
    return {
      success: false,
      message: "Invalid OTP",
    }
  }

  // if (result.status === "approved") {
  //   return {
  //     success: true,
  //     message: "OTP verified successfully",
  //   }
  // }

  // return {
  //   success: false,
  //   message: "Invalid OTP",
  // }
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendEmailOTP = async (email: string) => {
  // generate a random 4 digit otp
  const otp = Math.floor(1000 + Math.random() * 9000).toString()
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
    html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
  }

  await transporter.sendMail(mailOptions)

  return {
    success: true,
    message: "OTP sent successfully",
    data: {
      verifyOTP: otp,
      email,
    },
  }
}
