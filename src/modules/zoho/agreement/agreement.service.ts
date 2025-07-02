import { db } from "../../../config/db"
import { generateAgreementPDF } from "./agreement.utils"
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
