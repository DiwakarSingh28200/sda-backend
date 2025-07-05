import crypto from "crypto"

export const validateRazorpaySignature = (
  rawBody: string,
  signature: string,
  secret: string
): boolean => {
  const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex")

  return expectedSignature === signature
}
