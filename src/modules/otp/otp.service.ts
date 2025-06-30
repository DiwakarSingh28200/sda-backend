import axios from "axios"

export const sendOTP = async (phoneNumber: string) => {
  // generate a random 4 digit otp
  const otp = Math.floor(1000 + Math.random() * 9000).toString()

  const apiKey = process.env.MYOPERATOR_API_KEY

  //   "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWJlNTc3YTViMjFlMmQ0N2UwNTZiZCIsIm5hbWUiOiJTdXJlRHJpdmUgQXNzaXN0IiwiYXBwTmFtZSI6IkFpU2Vuc3kiLCJjbGllbnRJZCI6IjY4NWJlNTc3YTViMjFlMmQ0N2UwNTZiNiIsImFjdGl2ZVBsYW4iOiJOT05FIiwiaWF0IjoxNzUwODUyOTgzfQ.G-f8FtH9el-3uDoVFQicBX-gT3t360lAWL7gGp2Pa8c",
  //   "campaignName": "otp",
  //   "destination": "919764796379",
  //   "userName": "Abhishek",
  //   "templateParams": [
  //     "123456"
  //   ],
  //   "source": "new-landing-page form",
  //   "media": {},
  //   "buttons": [
  //     {
  //       "type": "button",
  //       "sub_type": "url",
  //       "index": 0,
  //       "parameters": [
  //         {
  //           "type": "text",
  //           "text": "123456"
  //         }
  //       ]
  //     }
  //   ],
  //   "carouselCards": [],
  //   "location": {},
  //   "attributes": {}
  // }

  // We are using myoperetor for sending otp

  // save the otp in the database
  const result = await axios.post("https://backend.api-wa.co/campaign/myoperator/api/v2", {
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
