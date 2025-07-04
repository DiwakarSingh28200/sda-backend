import fs from "fs"
import path from "path"
import { chromium } from "playwright"

export function renderTemplate(template: string, data: Record<string, string>) {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => data[key.trim()] || "")
}

export const generateAgreementPDF = async (data: Record<string, string>): Promise<Uint8Array> => {
  // const templatePath = path.join(__dirname, "./dealer-agreement.template.html")
  const templatePath = path.join(
    process.cwd(),
    "src",
    "template",
    "dealer-agreement.template.html"
  )

  const rawHtml = fs.readFileSync(templatePath, "utf-8")
  const compiledHtml = renderTemplate(rawHtml, data)

  const browser = await chromium.launch({
    headless: true,
  })

  const page = await browser.newPage()
  await page.setContent(compiledHtml, { waitUntil: "domcontentloaded" })

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      right: "10px",
      bottom: "40px",
      left: "10px",
    },
  })

  await browser.close()

  return pdfBuffer
}

export interface ServiceRateCardItem {
  SERVICE_CATEGORY: string
  CHARGES_DAY: string
  CHARGES_NIGHT: string
  FIXED_DISTANCE_KM: string
  ADDITIONAL_PER_KM_RATE: string
}

// Define the complete structure of your vendorAgreementData
export interface VendorAgreementData {
  AGREEMENT_DAY: string
  AGREEMENT_MONTH: string
  AGREEMENT_YEAR: string
  SDA_SIGNATORY_NAME: string
  SDA_SIGNATORY_DESIGNATION: string
  SDA_SIGNATURE_DATE: string
  SDA_SIGNATURE_PLACE: string

  VENDOR_FULL_LEGAL_NAME: string
  VENDOR_ENTITY_TYPE: string
  VENDOR_REGISTERED_ADDRESS: string
  VENDOR_REGISTRATION_ID: string
  VENDOR_AUTH_SIGNATORY_NAME: string
  VENDOR_AUTH_SIGNATORY_DESIGNATION: string
  VENDOR_SIGNATURE_DATE: string
  VENDOR_SIGNATURE_PLACE: string

  VENDOR_WORKSHOP_NAME: string // Renamed from GARAGE_NAME
  PRIMARY_CONTACT_NUMBER: string // Renamed from CONTACT_NUMBER
  ALTERNATE_CONTACT_NUMBER: string
  BUSINESS_ADDRESS: string // Renamed from COMMUNICATION_ADDRESS
  PINCODE: string
  WORK_TIMINGS: string

  REPAIR_ON_SITE_2W: boolean // Boolean
  REPAIR_ON_SITE_4W: boolean // Boolean
  TOWING_2W: boolean // Boolean
  TOWING_4W: boolean // Boolean
  SERVICE_AVAILABLE_24X7: boolean // Boolean

  ACCOUNT_HOLDER_NAME: string
  BANK_ACCOUNT_NO: string
  BANK_NAME: string
  BANK_IFSC_CODE: string
  PAN_NUMBER: string
  GSTIN: string
  BUSINESS_ADDRESS_PROOF: boolean // Boolean (new in payload)

  // Assuming DAY_CONTACT_NAME_1, etc., are part of the full payload if 24x7 is true,
  // even if not in the minimal payload provided here. Add them if needed in the actual full payload.
  DAY_CONTACT_NAME_1?: string
  DAY_CONTACT_NO_1?: string
  DAY_CONTACT_NAME_2?: string
  DAY_CONTACT_NO_2?: string
  NIGHT_CONTACT_NAME_1?: string
  NIGHT_CONTACT_NO_1?: string
  NIGHT_CONTACT_NAME_2?: string
  NIGHT_CONTACT_NO_2?: string
  VENDOR_EMAIL?: string // Add this if you intend to use it from payload for notices/contacts

  TOWING_2W_FLATBED_UPTO_KMS?: string // No direct match in payload's SERVICE_RATE_CARD
  TOWING_2W_FLATBED_EXTRA_CHARGES?: string // No direct match in payload's SERVICE_RATE_CARD
  TOWING_4W_FLATBED_UPTO_KMS?: string // No direct match in payload's SERVICE_RATE_CARD
  TOWING_4W_FLATBED_EXTRA_CHARGES?: string // No direct match in payload's SERVICE_RATE_CARD
  REPAIR_ON_SPOT_2W_UPTO_KMS?: string // No direct match in payload's SERVICE_RATE_CARD
  REPAIR_ON_SPOT_4W_UPTO_KMS?: string // No direct match in payload's SERVICE_RATE_CARD
  CANCELLATION_CHARGES?: string // No direct match in payload's SERVICE_RATE_CARD

  TRANSFER_4W_FLATBED_UPTO_KMS?: string // No direct match in payload
  TRANSFER_4W_FLATBED_EXTRA_CHARGES?: string // No direct match in payload

  END_OF_LIFE_BASE_KMS?: string // No direct match in payload
  END_OF_LIFE_EXTRA_CHARGES?: string // No direct match in payload

  SERVICE_RATE_CARD: ServiceRateCardItem[] // Array of objects
}

export const generateVendorAgreementPDF = async (
  data: VendorAgreementData
): Promise<Uint8Array> => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "template",
    "vendor-agreement.template.html"
  )

  const rawHtml = fs.readFileSync(templatePath, "utf-8")
  const compiledHtml = renderTemplate(rawHtml, data as unknown as Record<string, string>)

  const browser = await chromium.launch({
    headless: true,
  })

  const page = await browser.newPage()
  await page.setContent(compiledHtml, { waitUntil: "domcontentloaded" })

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      right: "10px",
      bottom: "40px",
      left: "10px",
    },
  })

  await browser.close()

  return pdfBuffer
}
