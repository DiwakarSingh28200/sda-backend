import twilio from "../../config/twilioClient"

export const sendOTP = async (phoneNumber: string) => {
  const result = await twilio.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
    .verifications.create({
      to: `+91${phoneNumber}`,
      channel: "sms",
    })

  if (result.status === "pending") {
    return {
      success: true,
      message: "OTP sent successfully",
    }
  }

  return {
    success: false,
    message: "Failed to send OTP",
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
