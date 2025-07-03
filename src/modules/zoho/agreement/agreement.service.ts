import { db } from "../../../config/db"
import { generateAgreementPDF, generateVendorAgreementPDF } from "./agreement.utils"
import moment from "moment"
import nodemailer from "nodemailer"
import { DealerAgreementTemplateData } from "./agreement.type"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})
export const generateDealerAgreement = async (
  dealerId: string,
  payload: DealerAgreementTemplateData
) => {
  const { data: dealerData, error: dealerError } = await db
    .from("dealers")
    .select(
      "*, created_by:created_by(id, first_name, last_name, department_id, role:role_id(id, role_name))"
    )
    .eq("id", dealerId)
    .single()

  if (!dealerData) {
    return {
      success: false,
      message: "Dealer not found",
    }
  }

  // Generate dealer agreement
  const dealerAgreementData = {
    // Date
    DAY: payload.DAY || moment(dealerData.created_at).format("DD"),
    MONTH: payload.MONTH || moment(dealerData.created_at).format("MMMM"),

    // SDA Signatory
    SDA_SALES_HEAD_NAME:
      payload.SDA_SALES_HEAD_NAME ||
      dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
    SDA_SALES_HEAD_DESIGNATION:
      payload.SDA_SALES_HEAD_DESIGNATION || dealerData.created_by?.role?.role_name,

    SDA_SIGNATORY_NAME:
      payload.SDA_SIGNATORY_NAME ||
      dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
    SDA_SIGNATORY_DESIGNATION:
      payload.SDA_SIGNATORY_DESIGNATION || dealerData.created_by?.role?.role_name,
    SDA_SIGNATURE_DATE: payload.SDA_SIGNATURE_DATE || "",
    SDA_SIGNATURE_PLACE: payload.SDA_SIGNATURE_PLACE || "",

    SDA_SIGNATORY_NAME_ANNEX1:
      payload.SDA_SIGNATORY_NAME_ANNEX1 ||
      dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
    SDA_SIGNATORY_DESIGNATION_ANNEX1:
      payload.SDA_SIGNATORY_DESIGNATION_ANNEX1 || dealerData.created_by?.role?.role_name,
    SDA_SIGNATURE_DATE_ANNEX1: payload.SDA_SIGNATURE_DATE_ANNEX1 || "",
    SDA_SIGNATURE_PLACE_ANNEX1: payload.SDA_SIGNATURE_PLACE_ANNEX1 || "",

    SDA_SIGNATORY_NAME_ANNEX2:
      payload.SDA_SIGNATORY_NAME_ANNEX2 ||
      dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
    SDA_SIGNATORY_DESIGNATION_ANNEX2:
      payload.SDA_SIGNATORY_DESIGNATION_ANNEX2 || dealerData.created_by?.role?.role_name,
    SDA_SIGNATURE_DATE_ANNEX2: payload.SDA_SIGNATURE_DATE_ANNEX2 || "",
    SDA_SIGNATURE_PLACE_ANNEX2: payload.SDA_SIGNATURE_PLACE_ANNEX2 || "",

    SDA_SIGNATORY_NAME_ANNEX3:
      payload.SDA_SIGNATORY_NAME_ANNEX3 ||
      dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
    SDA_SIGNATORY_DESIGNATION_ANNEX3:
      payload.SDA_SIGNATORY_DESIGNATION_ANNEX3 || dealerData.created_by?.role?.role_name,
    SDA_SIGNATURE_DATE_ANNEX3: payload.SDA_SIGNATURE_DATE_ANNEX3 || "",
    SDA_SIGNATURE_PLACE_ANNEX3: payload.SDA_SIGNATURE_PLACE_ANNEX3 || "",

    // Dealer Info
    DEALER_FULL_LEGAL_NAME: payload.DEALER_FULL_LEGAL_NAME || dealerData?.dealership_name,
    DEALER_ENTITY_TYPE: payload.DEALER_ENTITY_TYPE || dealerData.dealership_type,
    DEALER_ADDRESS: payload.DEALER_ADDRESS || dealerData?.registered_address,
    DEALER_REGISTRATION_ID_IF_APPLICABLE:
      payload.DEALER_REGISTRATION_ID_IF_APPLICABLE || dealerData?.gst_number,

    // Dealer Signatory
    DEALER_AUTHORIZED_SIGNATORY_NAME:
      payload.DEALER_AUTHORIZED_SIGNATORY_NAME || dealerData?.owner_name,
    DEALER_AUTHORIZED_SIGNATORY_DESIGNATION:
      payload.DEALER_AUTHORIZED_SIGNATORY_DESIGNATION || "Owner",

    DEALER_NAME_FOR_SIGNATURE: payload.DEALER_NAME_FOR_SIGNATURE || dealerData?.dealership_name,
    DEALER_SIGNATORY_NAME: payload.DEALER_SIGNATORY_NAME || dealerData?.owner_name,
    DEALER_SIGNATORY_DESIGNATION: payload.DEALER_SIGNATORY_DESIGNATION || "Owner",
    DEALER_SIGNATURE_DATE: payload.DEALER_SIGNATURE_DATE || "",
    DEALER_SIGNATURE_PLACE: payload.DEALER_SIGNATURE_PLACE || "",

    DEALER_NAME_FOR_SIGNATURE_ANNEX1:
      payload.DEALER_NAME_FOR_SIGNATURE_ANNEX1 || dealerData?.dealership_name,
    DEALER_SIGNATORY_NAME_ANNEX1: payload.DEALER_SIGNATORY_NAME_ANNEX1 || dealerData?.owner_name,
    DEALER_SIGNATORY_DESIGNATION_ANNEX1: payload.DEALER_SIGNATORY_DESIGNATION_ANNEX1 || "Owner",
    DEALER_SIGNATURE_DATE_ANNEX1: payload.DEALER_SIGNATURE_DATE_ANNEX1 || "",
    DEALER_SIGNATURE_PLACE_ANNEX1: payload.DEALER_SIGNATURE_PLACE_ANNEX1 || "",

    DEALER_NAME_FOR_SIGNATURE_ANNEX2:
      payload.DEALER_NAME_FOR_SIGNATURE_ANNEX2 || dealerData?.dealership_name,
    DEALER_SIGNATORY_NAME_ANNEX2: payload.DEALER_SIGNATORY_NAME_ANNEX2 || dealerData?.owner_name,
    DEALER_SIGNATORY_DESIGNATION_ANNEX2: payload.DEALER_SIGNATORY_DESIGNATION_ANNEX2 || "Owner",
    DEALER_SIGNATURE_DATE_ANNEX2: payload.DEALER_SIGNATURE_DATE_ANNEX2 || "",
    DEALER_SIGNATURE_PLACE_ANNEX2: payload.DEALER_SIGNATURE_PLACE_ANNEX2 || "",

    DEALER_NAME_FOR_SIGNATURE_ANNEX3:
      payload.DEALER_NAME_FOR_SIGNATURE_ANNEX3 || dealerData?.dealership_name,
    DEALER_SIGNATORY_NAME_ANNEX3: payload.DEALER_SIGNATORY_NAME_ANNEX3 || dealerData?.owner_name,
    DEALER_SIGNATORY_DESIGNATION_ANNEX3: payload.DEALER_SIGNATORY_DESIGNATION_ANNEX3 || "Owner",
    DEALER_SIGNATURE_DATE_ANNEX3: payload.DEALER_SIGNATURE_DATE_ANNEX3 || "",
    DEALER_SIGNATURE_PLACE_ANNEX3: payload.DEALER_SIGNATURE_PLACE_ANNEX3 || "",

    // Dealer Notice Contact
    DEALER_NAME_FOR_NOTICES: payload.DEALER_NAME_FOR_NOTICES || dealerData?.dealership_name,
    DEALER_ADDRESS_FOR_NOTICES:
      payload.DEALER_ADDRESS_FOR_NOTICES || dealerData?.registered_address,
    DEALER_EMAIL_FOR_NOTICES: payload.DEALER_EMAIL_FOR_NOTICES || dealerData?.owner_email,
    DEALER_REPRESENTATIVE_NAME_DESIGNATION_FOR_NOTICES:
      payload.DEALER_REPRESENTATIVE_NAME_DESIGNATION_FOR_NOTICES ||
      `${dealerData?.owner_name}, Owner`,

    // Security Cheque
    CHEQUE_NO: payload.CHEQUE_NO || "",
    CHEQUE_DATE: payload.CHEQUE_DATE || "",
    CHEQUE_AMOUNT: payload.CHEQUE_AMOUNT || "",

    // Commission Structure - Core
    SURE_SHIELD_CORE_COMMISSION_1_YR: payload.SURE_SHIELD_CORE_COMMISSION_1_YR || "",
    SURE_SHIELD_CORE_COMMISSION_2_YR: payload.SURE_SHIELD_CORE_COMMISSION_2_YR || "",
    SURE_SHIELD_CORE_COMMISSION_3_YR: payload.SURE_SHIELD_CORE_COMMISSION_3_YR || "",
    SURE_SHIELD_CORE_COMMISSION_4_YR: payload.SURE_SHIELD_CORE_COMMISSION_4_YR || "",

    // Commission Structure - Max
    SURE_SHIELD_MAX_COMMISSION_1_YR: payload.SURE_SHIELD_MAX_COMMISSION_1_YR || "",
    SURE_SHIELD_MAX_COMMISSION_2_YR: payload.SURE_SHIELD_MAX_COMMISSION_2_YR || "",
    SURE_SHIELD_MAX_COMMISSION_3_YR: payload.SURE_SHIELD_MAX_COMMISSION_3_YR || "",
    SURE_SHIELD_MAX_COMMISSION_4_YR: payload.SURE_SHIELD_MAX_COMMISSION_4_YR || "",
  }

  const pdfBuffer = await generateAgreementPDF(dealerAgreementData as Record<string, string>)
  const fileName = `dealership-agreements/${dealerId}-agreement-${Date.now()}.pdf`

  const { error: agreementError } = await db.storage
    .from("dealership-agreements")
    .upload(fileName, pdfBuffer, {
      upsert: true,
      contentType: "application/pdf",
    })

  if (agreementError) throw new Error("Failed to upload agreement: " + agreementError.message)

  const { data: agreementData } = await db.storage
    .from("dealership-agreements")
    .getPublicUrl(fileName)

  await db
    .from("dealers")
    .update({ agreement_url: agreementData.publicUrl })
    .eq("id", dealerId)
    .select()
    .single()

  return pdfBuffer
}

export const sendDealerAgreementEmail = async (
  dealerId: string,
  payload: DealerAgreementTemplateData
) => {
  const { data: dealerData, error: dealerError } = await db
    .from("dealers")
    .select(
      "*, created_by:created_by(id, first_name, last_name, department_id, role:role_id(id, role_name))"
    )
    .eq("id", dealerId)
    .single()

  if (!dealerData) {
    return {
      success: false,
      message: "Dealer not found",
    }
  }

  // Generate dealer agreement
  const dealerAgreementData = {
    // Date
    DAY: payload.DAY || moment(dealerData.created_at).format("DD"),
    MONTH: payload.MONTH || moment(dealerData.created_at).format("MMMM"),

    // SDA Signatory
    SDA_SALES_HEAD_NAME:
      payload.SDA_SALES_HEAD_NAME ||
      dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
    SDA_SALES_HEAD_DESIGNATION:
      payload.SDA_SALES_HEAD_DESIGNATION || dealerData.created_by?.role?.role_name,

    SDA_SIGNATORY_NAME:
      payload.SDA_SIGNATORY_NAME ||
      dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
    SDA_SIGNATORY_DESIGNATION:
      payload.SDA_SIGNATORY_DESIGNATION || dealerData.created_by?.role?.role_name,
    SDA_SIGNATURE_DATE: payload.SDA_SIGNATURE_DATE || "",
    SDA_SIGNATURE_PLACE: payload.SDA_SIGNATURE_PLACE || "",

    SDA_SIGNATORY_NAME_ANNEX1:
      payload.SDA_SIGNATORY_NAME_ANNEX1 ||
      dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
    SDA_SIGNATORY_DESIGNATION_ANNEX1:
      payload.SDA_SIGNATORY_DESIGNATION_ANNEX1 || dealerData.created_by?.role?.role_name,
    SDA_SIGNATURE_DATE_ANNEX1: payload.SDA_SIGNATURE_DATE_ANNEX1 || "",
    SDA_SIGNATURE_PLACE_ANNEX1: payload.SDA_SIGNATURE_PLACE_ANNEX1 || "",

    SDA_SIGNATORY_NAME_ANNEX2:
      payload.SDA_SIGNATORY_NAME_ANNEX2 ||
      dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
    SDA_SIGNATORY_DESIGNATION_ANNEX2:
      payload.SDA_SIGNATORY_DESIGNATION_ANNEX2 || dealerData.created_by?.role?.role_name,
    SDA_SIGNATURE_DATE_ANNEX2: payload.SDA_SIGNATURE_DATE_ANNEX2 || "",
    SDA_SIGNATURE_PLACE_ANNEX2: payload.SDA_SIGNATURE_PLACE_ANNEX2 || "",

    SDA_SIGNATORY_NAME_ANNEX3:
      payload.SDA_SIGNATORY_NAME_ANNEX3 ||
      dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
    SDA_SIGNATORY_DESIGNATION_ANNEX3:
      payload.SDA_SIGNATORY_DESIGNATION_ANNEX3 || dealerData.created_by?.role?.role_name,
    SDA_SIGNATURE_DATE_ANNEX3: payload.SDA_SIGNATURE_DATE_ANNEX3 || "",
    SDA_SIGNATURE_PLACE_ANNEX3: payload.SDA_SIGNATURE_PLACE_ANNEX3 || "",

    // Dealer Info
    DEALER_FULL_LEGAL_NAME: payload.DEALER_FULL_LEGAL_NAME || dealerData?.dealership_name,
    DEALER_ENTITY_TYPE: payload.DEALER_ENTITY_TYPE || dealerData.dealership_type,
    DEALER_ADDRESS: payload.DEALER_ADDRESS || dealerData?.registered_address,
    DEALER_REGISTRATION_ID_IF_APPLICABLE:
      payload.DEALER_REGISTRATION_ID_IF_APPLICABLE || dealerData?.gst_number,

    // Dealer Signatory
    DEALER_AUTHORIZED_SIGNATORY_NAME:
      payload.DEALER_AUTHORIZED_SIGNATORY_NAME || dealerData?.owner_name,
    DEALER_AUTHORIZED_SIGNATORY_DESIGNATION:
      payload.DEALER_AUTHORIZED_SIGNATORY_DESIGNATION || "Owner",

    DEALER_NAME_FOR_SIGNATURE: payload.DEALER_NAME_FOR_SIGNATURE || dealerData?.dealership_name,
    DEALER_SIGNATORY_NAME: payload.DEALER_SIGNATORY_NAME || dealerData?.owner_name,
    DEALER_SIGNATORY_DESIGNATION: payload.DEALER_SIGNATORY_DESIGNATION || "Owner",
    DEALER_SIGNATURE_DATE: payload.DEALER_SIGNATURE_DATE || "",
    DEALER_SIGNATURE_PLACE: payload.DEALER_SIGNATURE_PLACE || "",

    DEALER_NAME_FOR_SIGNATURE_ANNEX1:
      payload.DEALER_NAME_FOR_SIGNATURE_ANNEX1 || dealerData?.dealership_name,
    DEALER_SIGNATORY_NAME_ANNEX1: payload.DEALER_SIGNATORY_NAME_ANNEX1 || dealerData?.owner_name,
    DEALER_SIGNATORY_DESIGNATION_ANNEX1: payload.DEALER_SIGNATORY_DESIGNATION_ANNEX1 || "Owner",
    DEALER_SIGNATURE_DATE_ANNEX1: payload.DEALER_SIGNATURE_DATE_ANNEX1 || "",
    DEALER_SIGNATURE_PLACE_ANNEX1: payload.DEALER_SIGNATURE_PLACE_ANNEX1 || "",

    DEALER_NAME_FOR_SIGNATURE_ANNEX2:
      payload.DEALER_NAME_FOR_SIGNATURE_ANNEX2 || dealerData?.dealership_name,
    DEALER_SIGNATORY_NAME_ANNEX2: payload.DEALER_SIGNATORY_NAME_ANNEX2 || dealerData?.owner_name,
    DEALER_SIGNATORY_DESIGNATION_ANNEX2: payload.DEALER_SIGNATORY_DESIGNATION_ANNEX2 || "Owner",
    DEALER_SIGNATURE_DATE_ANNEX2: payload.DEALER_SIGNATURE_DATE_ANNEX2 || "",
    DEALER_SIGNATURE_PLACE_ANNEX2: payload.DEALER_SIGNATURE_PLACE_ANNEX2 || "",

    DEALER_NAME_FOR_SIGNATURE_ANNEX3:
      payload.DEALER_NAME_FOR_SIGNATURE_ANNEX3 || dealerData?.dealership_name,
    DEALER_SIGNATORY_NAME_ANNEX3: payload.DEALER_SIGNATORY_NAME_ANNEX3 || dealerData?.owner_name,
    DEALER_SIGNATORY_DESIGNATION_ANNEX3: payload.DEALER_SIGNATORY_DESIGNATION_ANNEX3 || "Owner",
    DEALER_SIGNATURE_DATE_ANNEX3: payload.DEALER_SIGNATURE_DATE_ANNEX3 || "",
    DEALER_SIGNATURE_PLACE_ANNEX3: payload.DEALER_SIGNATURE_PLACE_ANNEX3 || "",

    // Dealer Notice Contact
    DEALER_NAME_FOR_NOTICES: payload.DEALER_NAME_FOR_NOTICES || dealerData?.dealership_name,
    DEALER_ADDRESS_FOR_NOTICES:
      payload.DEALER_ADDRESS_FOR_NOTICES || dealerData?.registered_address,
    DEALER_EMAIL_FOR_NOTICES: payload.DEALER_EMAIL_FOR_NOTICES || dealerData?.owner_email,
    DEALER_REPRESENTATIVE_NAME_DESIGNATION_FOR_NOTICES:
      payload.DEALER_REPRESENTATIVE_NAME_DESIGNATION_FOR_NOTICES ||
      `${dealerData?.owner_name}, Owner`,

    // Security Cheque
    CHEQUE_NO: payload.CHEQUE_NO || "",
    CHEQUE_DATE: payload.CHEQUE_DATE || "",
    CHEQUE_AMOUNT: payload.CHEQUE_AMOUNT || "",

    // Commission Structure - Core
    SURE_SHIELD_CORE_COMMISSION_1_YR: payload.SURE_SHIELD_CORE_COMMISSION_1_YR || "",
    SURE_SHIELD_CORE_COMMISSION_2_YR: payload.SURE_SHIELD_CORE_COMMISSION_2_YR || "",
    SURE_SHIELD_CORE_COMMISSION_3_YR: payload.SURE_SHIELD_CORE_COMMISSION_3_YR || "",
    SURE_SHIELD_CORE_COMMISSION_4_YR: payload.SURE_SHIELD_CORE_COMMISSION_4_YR || "",

    // Commission Structure - Max
    SURE_SHIELD_MAX_COMMISSION_1_YR: payload.SURE_SHIELD_MAX_COMMISSION_1_YR || "",
    SURE_SHIELD_MAX_COMMISSION_2_YR: payload.SURE_SHIELD_MAX_COMMISSION_2_YR || "",
    SURE_SHIELD_MAX_COMMISSION_3_YR: payload.SURE_SHIELD_MAX_COMMISSION_3_YR || "",
    SURE_SHIELD_MAX_COMMISSION_4_YR: payload.SURE_SHIELD_MAX_COMMISSION_4_YR || "",
  }

  const pdfBuffer = await generateAgreementPDF(dealerAgreementData as Record<string, string>)

  await transporter.sendMail({
    from: `"SureDrive Assist" <${process.env.EMAIL_USER}>`,
    to: dealerData.owner_email!,
    subject: `Dealership Agreement – ${dealerData.dealership_name}`,
    text: `Dear ${dealerData.dealership_name},\n\nPlease find attached your signed dealership agreement with SureDrive Assist.\n\nRegards,\nSureDrive Team`,
    attachments: [
      {
        filename: `Dealership-Agreement-${dealerData.dealership_name?.replace(/\s+/g, "_")}.pdf`,
        // @ts-ignore
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  })

  return {
    success: true,
    message: "Email sent successfully",
  }
}

export const downloadDealerAgreement = async (dealerId: string) => {
  const { data: dealerData, error: dealerError } = await db
    .from("dealers")
    .select(
      "*, created_by:created_by(id, first_name, last_name, department_id, role:role_id(id, role_name))"
    )
    .eq("id", dealerId)
    .single()

  if (!dealerData) {
    return {
      success: false,
      message: "Dealer not found",
    }
  }

  // Generate dealer agreement
  const dealerAgreementData = {
    // Date
    DAY: moment(dealerData.created_at).format("DD"),
    MONTH: moment(dealerData.created_at).format("MMMM"),

    // SDA Signatory
    SDA_SALES_HEAD_NAME:
      dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
    SDA_SALES_HEAD_DESIGNATION: dealerData.created_by?.role?.role_name,

    SDA_SIGNATORY_NAME: dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
    SDA_SIGNATORY_DESIGNATION: dealerData.created_by?.role?.role_name,
    SDA_SIGNATURE_DATE: "",
    SDA_SIGNATURE_PLACE: "",

    SDA_SIGNATORY_NAME_ANNEX1:
      dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
    SDA_SIGNATORY_DESIGNATION_ANNEX1: dealerData.created_by?.role?.role_name,
    SDA_SIGNATURE_DATE_ANNEX1: "",

    SDA_SIGNATORY_NAME_ANNEX2:
      dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
    SDA_SIGNATORY_DESIGNATION_ANNEX2: dealerData.created_by?.role?.role_name,
    SDA_SIGNATURE_DATE_ANNEX2: "",
    SDA_SIGNATURE_PLACE_ANNEX2: "",

    SDA_SIGNATORY_NAME_ANNEX3:
      dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
    SDA_SIGNATORY_DESIGNATION_ANNEX3: dealerData.created_by?.role?.role_name,
    SDA_SIGNATURE_DATE_ANNEX3: "",
    SDA_SIGNATURE_PLACE_ANNEX3: "",

    // Dealer Info
    DEALER_FULL_LEGAL_NAME: dealerData?.dealership_name,
    DEALER_ENTITY_TYPE: dealerData.dealership_type,
    DEALER_ADDRESS: dealerData?.registered_address,
    DEALER_REGISTRATION_ID_IF_APPLICABLE: dealerData?.gst_number,

    // Dealer Signatory
    DEALER_AUTHORIZED_SIGNATORY_NAME: dealerData?.owner_name,
    DEALER_AUTHORIZED_SIGNATORY_DESIGNATION: "Owner",

    DEALER_NAME_FOR_SIGNATURE: dealerData?.dealership_name,
    DEALER_SIGNATORY_NAME: dealerData?.owner_name,
    DEALER_SIGNATORY_DESIGNATION: "Owner",
    DEALER_SIGNATURE_DATE: "",
    DEALER_SIGNATURE_PLACE: "",

    DEALER_NAME_FOR_SIGNATURE_ANNEX1: dealerData?.dealership_name,
    DEALER_SIGNATORY_NAME_ANNEX1: dealerData?.owner_name,
    DEALER_SIGNATORY_DESIGNATION_ANNEX1: "Owner",
    DEALER_SIGNATURE_DATE_ANNEX1: "",
    DEALER_SIGNATURE_PLACE_ANNEX1: "",

    DEALER_NAME_FOR_SIGNATURE_ANNEX2: dealerData?.dealership_name,
    DEALER_SIGNATORY_NAME_ANNEX2: dealerData?.owner_name,
    DEALER_SIGNATORY_DESIGNATION_ANNEX2: "Owner",
    DEALER_SIGNATURE_DATE_ANNEX2: "",
    DEALER_SIGNATURE_PLACE_ANNEX2: "",

    DEALER_NAME_FOR_SIGNATURE_ANNEX3: dealerData?.dealership_name,
    DEALER_SIGNATORY_NAME_ANNEX3: dealerData?.owner_name,
    DEALER_SIGNATORY_DESIGNATION_ANNEX3: "Owner",
    DEALER_SIGNATURE_DATE_ANNEX3: "",
    DEALER_SIGNATURE_PLACE_ANNEX3: "",

    // Dealer Notice Contact
    DEALER_NAME_FOR_NOTICES: dealerData?.dealership_name,
    DEALER_ADDRESS_FOR_NOTICES: dealerData?.registered_address,
    DEALER_EMAIL_FOR_NOTICES: dealerData?.owner_email,
    DEALER_REPRESENTATIVE_NAME_DESIGNATION_FOR_NOTICES: `${dealerData?.owner_name}, Owner`,

    // Security Cheque
    CHEQUE_NO: "",
    CHEQUE_DATE: "",
    CHEQUE_AMOUNT: "",

    // Commission Structure - Core
    SURE_SHIELD_CORE_COMMISSION_1_YR: "",
    SURE_SHIELD_CORE_COMMISSION_2_YR: "",
    SURE_SHIELD_CORE_COMMISSION_3_YR: "",
    SURE_SHIELD_CORE_COMMISSION_4_YR: "",

    // Commission Structure - Max
    SURE_SHIELD_MAX_COMMISSION_1_YR: "",
    SURE_SHIELD_MAX_COMMISSION_2_YR: "",
    SURE_SHIELD_MAX_COMMISSION_3_YR: "",
    SURE_SHIELD_MAX_COMMISSION_4_YR: "",
  }

  const pdfBuffer = await generateAgreementPDF(dealerAgreementData as Record<string, string>)
  const fileName = `dealership-agreements/${dealerId}-agreement-${Date.now()}.pdf`

  const { error: agreementError } = await db.storage
    .from("dealership-agreements")
    .upload(fileName, pdfBuffer, {
      upsert: true,
      contentType: "application/pdf",
    })

  if (agreementError) throw new Error("Failed to upload agreement: " + agreementError.message)

  const { data: agreementData } = await db.storage
    .from("dealership-agreements")
    .getPublicUrl(fileName)

  await db
    .from("dealers")
    .update({ agreement_url: agreementData.publicUrl })
    .eq("id", dealerId)
    .select()
    .single()

  return pdfBuffer
}

export const generateVendorAgreement = async (vendorId: string) => {
  const vendorAgreementData = {
    DAY: "02",
    MONTH: "July",
    YEAR: "2025",

    SDA_SALES_HEAD_NAME: "Anjali Sharma",
    SDA_SALES_HEAD_DESIGNATION: "Regional Sales Head",

    SDA_SIGNATORY_NAME: "Anjali Sharma",
    SDA_SIGNATORY_DESIGNATION: "Regional Sales Head",
    SDA_SIGNATURE_DATE: "02-07-2025",
    SDA_SIGNATURE_PLACE: "Gurugram",

    VENDOR_FULL_LEGAL_NAME: "ABC Towing Services Pvt. Ltd.",
    VENDOR_ENTITY_TYPE: "Private Limited",
    VENDOR_ADDRESS: "Plot No. 12, Industrial Area, Pune, Maharashtra",
    VENDOR_REGISTRATION_ID_IF_APPLICABLE: "MH12AB1234",
    VENDOR_AUTHORIZED_SIGNATORY_NAME: "Rakesh Yadav",
    VENDOR_AUTHORIZED_SIGNATORY_DESIGNATION: "Operations Manager",

    VENDOR_NAME_FOR_SIGNATURE: "ABC Towing Services Pvt. Ltd.",
    VENDOR_SIGNATORY_NAME: "Rakesh Yadav",
    VENDOR_SIGNATORY_DESIGNATION: "Operations Manager",
    VENDOR_SIGNATURE_DATE: "02-07-2025",
    VENDOR_SIGNATURE_PLACE: "Pune",

    VENDOR_FULL_NAME_FOR_NOTICES: "ABC Towing Services Pvt. Ltd.",
    VENDOR_ADDRESS_FOR_NOTICES: "Plot No. 12, Industrial Area, Pune, Maharashtra",
    VENDOR_EMAIL_ADDRESS_FOR_NOTICES: "support@abctowing.com",

    SIGNATURE_DATE_MAIN_AGREEMENT: "02-07-2025",

    SDA_ID: "SDA-00043",
    GARAGE_NAME: "ABC Garage & Services",
    CONTACT_NUMBER: "9876543210",
    COMMUNICATION_ADDRESS: "12 Park Lane, Pune",
    ALTERNATE_CONTACT_NUMBER: "9876543211",
    PINCODE: "411001",
    WORK_TIMINGS: "9:00 AM - 9:00 PM",

    RSA_CHECKED: "checked",
    TOWING_CHECKED: "checked",
    TWO_WHEELER_SERVICE_CHECKED: "checked",
    FOUR_WHEELER_SERVICE_CHECKED: "checked",
    "24x7_YES_CHECKED": "checked",
    "24x7_NO_CHECKED": "",

    DAY_DUTY_CONTACT_PERSON_1: "Manoj Singh",
    DAY_DUTY_CONTACT_NO_1: "9876000001",
    DAY_DUTY_CONTACT_PERSON_2: "Neha Kumari",
    DAY_DUTY_CONTACT_NO_2: "9876000002",
    NIGHT_DUTY_CONTACT_PERSON_1: "Pawan Kumar",
    NIGHT_DUTY_CONTACT_NO_1: "9876000003",
    NIGHT_DUTY_CONTACT_PERSON_2: "Kavita Sharma",
    NIGHT_DUTY_CONTACT_NO_2: "9876000004",
    CONTACT_EMAIL_ID: "ops@abctowing.com",

    ACCOUNT_HOLDER_NAME: "ABC Towing Services Pvt. Ltd.",
    BANK_ACCOUNT_NO: "123456789012",
    NAME_OF_BANK: "HDFC Bank",
    BRANCH_NAME: "Pune Main Branch",
    IFSC_CODE: "HDFC0001234",
    PAN_CARD_NUMBER: "ABCDE1234F",
    GST_NUMBER: "27ABCDE1234F1Z5",
    AADHARCARD_NUMBER: "123456789012",

    WHEEL_TOW_UPTO_KMS: "10 KM",
    WHEEL_TOW_2W_ADDITIONAL_CHARGES: "₹200",
    WHEEL_TOW_4W_ADDITIONAL_CHARGES_UPTO_KMS: "₹300",

    FLAT_BED_UPTO_KMS: "15 KM",
    FLAT_BED_2W_ADDITIONAL_CHARGES: "₹250",
    FLAT_BED_4W_ADDITIONAL_CHARGES_UPTO_KMS: "₹350",

    REPAIR_ON_SPOT_2W_UPTO: "₹100",
    REPAIR_ON_SPOT_2W_KMS: "10 KM",
    REPAIR_ON_SPOT_4W_UPTO: "₹200",
    REPAIR_ON_SPOT_4W_KMS: "15 KM",

    ADDITIONAL_CHARGES_ABOVE_KMS: "₹25/km",
    CANCELLATION_CHARGES: "₹150",

    TRANSFER_WHEEL_TOW_UPTO_KMS: "15 KM",
    TRANSFER_WHEEL_TOW_ADDITIONAL_CHARGES: "₹300",
    TRANSFER_FLAT_BED_UPTO_KMS: "20 KM",
    TRANSFER_FLAT_BED_ADDITIONAL_CHARGES: "₹350",

    EOL_WHEEL_TOW_4W: "₹800",
    EOL_WHEEL_TOW_4W_2W_1: "₹1000",
    EOL_WHEEL_TOW_4W_2W_2: "₹1200",
    EOL_WHEEL_TOW_BASE_KMS: "20 KM",
    EOL_WHEEL_TOW_ADDITIONAL_CHARGES: "₹50/km",

    SDA_SIGNATORY_NAME_ANNEX2: "Anjali Sharma",
    SDA_SIGNATURE_DATE_ANNEX2: "02-07-2025",
    SDA_SIGNATURE_PLACE_ANNEX2: "Gurugram",

    VENDOR_NAME_FOR_SIGNATURE_ANNEX2: "ABC Towing Services Pvt. Ltd.",
    VENDOR_SIGNATORY_NAME_ANNEX2: "Rakesh Yadav",
    VENDOR_SIGNATORY_DESIGNATION_ANNEX2: "Operations Manager",
    VENDOR_SIGNATURE_DATE_ANNEX2: "02-07-2025",
    VENDOR_SIGNATURE_PLACE_ANNEX2: "Pune",
  }

  const pdfBuffer = await generateVendorAgreementPDF(vendorAgreementData as Record<string, string>)
  const fileName = `vendor-agreements/${vendorId}-agreement-${Date.now()}.pdf`

  return pdfBuffer
}
