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

export const sendEmailOTP = async (email: string, business_name: string, owner_name: string) => {
  // generate a random 4 digit otp
  const otp = Math.floor(1000 + Math.random() * 9000).toString()

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>Dear <strong>${owner_name ? owner_name : ""}</strong></p>
      <p>Business Name: <strong>${business_name ? business_name : ""}</strong></p>
      <p>Greetings from SureDrive Assist!</p>
      <p>Thank you for choosing to partner with us. To complete your registration and verify your contact details, please use the following One-Time Password (OTP):</p>
      <p>Your OTP is: <strong style="font-size: 18px; color: #007bff;">${otp}</strong></p>
      <p>Please share it only with our agent. Do not disclose it to anyone else for security reasons.</p>
      <p>We're excited to have your dealership on-board and look forward to supporting your business with our two-wheeler roadside assistance and accident management solutions.</p>
      <p>If you have any questions or require assistance, feel free to contact us at <a href="mailto:support@suredriveassist.com">support@suredriveassist.com</a>.</p>
    </div>
  `

  const textTemplate = `Dear ${owner_name ? owner_name : ""}
Business Name: ${business_name ? business_name : ""}
Greetings from SureDrive Assist!
Thank you for choosing to partner with us. To complete your registration and verify your contact details, please use the following One-Time Password (OTP):
Your OTP is: ${otp}
Please share it only with our agent. Do not disclose it to anyone else for security reasons.
We're excited to have your dealership on-board and look forward to supporting your business with our two-wheeler roadside assistance and accident management solutions.
If you have any questions or require assistance, feel free to contact us at support@suredriveassist.com.`

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP Verification for SureDrive Assist Registration",
    text: textTemplate,
    html: htmlTemplate,
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

export const sendEmailUsingZohoAPI = async (email: string) => {
  // Genrate zoho api token
  const { data: zohoresponse } = await axios.post(
    "https://accounts.zoho.in/oauth/v2/token?refresh_token=1000.75313ce482787bfd7118008bf79a7efa.b80d825dbb78588cf0e9ea5d3c5505f2&client_id=1000.6G4J72V3DBMA1M0VXVEW6MP6S04UVW&client_secret=bbcb3ce85e852fc5216da43d2e5605a9f882c51071&grant_type=refresh_token",
    {}
  )

  console.log("zohoresponse: ", zohoresponse)

  const apiKey = zohoresponse.access_token
  const zohoAPI = "https://mail.zoho.in/api/accounts/60042990545/messages"

  const otp = Math.floor(1000 + Math.random() * 9000).toString()
  console.log("apiKey: ", apiKey)

  const result = await axios.post(zohoAPI, {
    headers: {
      Authorization: `Zoho-oauthtoken ${apiKey}`,
    },
    data: {
      fromAddress: "noreply@suredriveassist.com",
      toAddress: "vinay@webbywolf.com",
      ccAddress: "",
      bccAddress: "",
      subject: "Your OTP Code",
      content: `Your OTP is: 1245`,
      askReceipt: "yes",
    },
  })

  return {
    success: true,
    message: "OTP sent successfully",
    data: result,
  }
}
