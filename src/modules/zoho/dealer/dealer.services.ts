import { generateAgreementPDF } from "../agreement/agreement.utils"
import { db } from "../../../config/db"

export const getAllPendingDealersService = async () => {
  const { data: dealers, error } = await db.from("dealers").select("*").eq("status", "pending")

  if (error || !dealers) throw new Error("Pending dealers not found")

  const results = await Promise.all(
    dealers.map(async (dealer) => {
      const dealerID = dealer.id

      // Step 1: Remove sensitive fields
      const { password, ...safeDealer } = dealer

      // Step 2: Fetch related data
      const [documents, finance_info, sub_dealerships, employees, services, wallet] =
        await Promise.all([
          db.from("dealer_documents").select("*").eq("dealer_id", dealerID).maybeSingle(),
          db.from("dealer_finance_info").select("*").eq("dealer_id", dealerID).maybeSingle(),
          db
            .from("dealers")
            .select(
              "id, dealer_id, dealership_name, registered_address, city, state, pincode, oems, owner_name, owner_contact, owner_email, vehicle_types, created_by"
            )
            .eq("parent_dealer_id", dealerID),
          db
            .from("dealer_employees")
            .select("name, role, contact_number, email")
            .eq("dealer_id", dealerID),
          db.from("dealer_services").select("*").eq("dealer_id", dealerID),
          db
            .from("wallet_config")
            .select(
              "average_vehicles_sold_monthly,rsa_percentage_sold,dealership_share,sda_share,credit_wallet_amount,minimum_wallet_amount"
            )
            .eq("dealer_id", dealerID),
        ])

      return {
        dealer: safeDealer,
        documents: documents.data ?? null,
        finance_info: finance_info.data ?? null,
        oem: safeDealer.oem ?? [],
        sub_dealerships: sub_dealerships.data ?? [],
        employees: employees.data ?? [],
        services: services.data ?? [],
        wallet: wallet.data ?? null,
      }
    })
  )

  return {
    success: true,
    message: "Pending dealers fetched successfully",
    data: results,
  }
}

export const approveDealerService = async (dealerId: string) => {
  const { data: dealer, error } = await db
    .from("dealers")
    .update({ status: "approved", login_enabled: true })
    .eq("id", dealerId)
    .select()
    .single()

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  const { data: dealerData, error: dealerError } = await db
    .from("dealers")
    .select("*, created_by:created_by(*)")
    .eq("id", dealerId)
    .single()

  if (!dealerData) {
    return {
      success: false,
      message: "Dealer not found",
    }
  }

  // find employee role
  const { data: employee, error: employeeError } = await db
    .from("employees")
    .select("*, role:roles(*)")
    .eq("id", dealerData.created_by?.id!)
    .single()

  // Generate dealer agreement
  // const dealerAgreementData = {
  //   // Date
  //   DAY: "29",
  //   MONTH: "June",

  //   // SDA Signatory
  //   SDA_SALES_HEAD_NAME:
  //     dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
  //   SDA_SALES_HEAD_DESIGNATION: dealerData.created_by?.department_id,

  //   SDA_SIGNATORY_NAME: dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
  //   SDA_SIGNATORY_DESIGNATION: employee?.role?.role_name,
  //   SDA_SIGNATURE_DATE: "",
  //   SDA_SIGNATURE_PLACE: "",

  //   SDA_SIGNATORY_NAME_ANNEX1:
  //     dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
  //   SDA_SIGNATORY_DESIGNATION_ANNEX1: employee?.role?.role_name,
  //   SDA_SIGNATURE_DATE_ANNEX1: "",
  //   SDA_SIGNATURE_PLACE_ANNEX1: "",

  //   SDA_SIGNATORY_NAME_ANNEX2:
  //     dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
  //   SDA_SIGNATORY_DESIGNATION_ANNEX2: employee?.role?.role_name,
  //   SDA_SIGNATURE_DATE_ANNEX2: "",
  //   SDA_SIGNATURE_PLACE_ANNEX2: "",

  //   SDA_SIGNATORY_NAME_ANNEX3:
  //     dealerData.created_by?.first_name + " " + dealerData.created_by?.last_name,
  //   SDA_SIGNATORY_DESIGNATION_ANNEX3: employee?.role?.role_name,
  //   SDA_SIGNATURE_DATE_ANNEX3: "",
  //   SDA_SIGNATURE_PLACE_ANNEX3: "",

  //   // Dealer Info
  //   DEALER_FULL_LEGAL_NAME: dealerData?.dealership_name,
  //   DEALER_ENTITY_TYPE: dealerData.dealership_type,
  //   DEALER_ADDRESS: dealerData?.registered_address,
  //   DEALER_REGISTRATION_ID_IF_APPLICABLE: dealerData?.gst_number,

  //   // Dealer Signatory
  //   DEALER_AUTHORIZED_SIGNATORY_NAME: dealerData?.owner_name,
  //   DEALER_AUTHORIZED_SIGNATORY_DESIGNATION: "Owner",

  //   DEALER_NAME_FOR_SIGNATURE: dealerData?.dealership_name,
  //   DEALER_SIGNATORY_NAME: dealerData?.owner_name,
  //   DEALER_SIGNATORY_DESIGNATION: "Owner",
  //   DEALER_SIGNATURE_DATE: "",
  //   DEALER_SIGNATURE_PLACE: "",

  //   DEALER_NAME_FOR_SIGNATURE_ANNEX1: dealerData?.dealership_name,
  //   DEALER_SIGNATORY_NAME_ANNEX1: dealerData?.owner_name,
  //   DEALER_SIGNATORY_DESIGNATION_ANNEX1: "Owner",
  //   DEALER_SIGNATURE_DATE_ANNEX1: "",
  //   DEALER_SIGNATURE_PLACE_ANNEX1: "",

  //   DEALER_NAME_FOR_SIGNATURE_ANNEX2: dealerData?.dealership_name,
  //   DEALER_SIGNATORY_NAME_ANNEX2: dealerData?.owner_name,
  //   DEALER_SIGNATORY_DESIGNATION_ANNEX2: "Owner",
  //   DEALER_SIGNATURE_DATE_ANNEX2: "",
  //   DEALER_SIGNATURE_PLACE_ANNEX2: "",

  //   DEALER_NAME_FOR_SIGNATURE_ANNEX3: dealerData?.dealership_name,
  //   DEALER_SIGNATORY_NAME_ANNEX3: dealerData?.owner_name,
  //   DEALER_SIGNATORY_DESIGNATION_ANNEX3: "Owner",
  //   DEALER_SIGNATURE_DATE_ANNEX3: "",
  //   DEALER_SIGNATURE_PLACE_ANNEX3: "",

  //   // Dealer Notice Contact
  //   DEALER_NAME_FOR_NOTICES: dealerData?.dealership_name,
  //   DEALER_ADDRESS_FOR_NOTICES: dealerData?.registered_address,
  //   DEALER_EMAIL_FOR_NOTICES: dealerData?.owner_email,
  //   DEALER_REPRESENTATIVE_NAME_DESIGNATION_FOR_NOTICES: `${dealerData?.owner_name}, Owner`,

  //   // Security Cheque
  //   CHEQUE_NO: "",
  //   CHEQUE_DATE: "",
  //   CHEQUE_AMOUNT: "",

  //   // Commission Structure - Core
  //   SURE_SHIELD_CORE_COMMISSION_1_YR: "",
  //   SURE_SHIELD_CORE_COMMISSION_2_YR: "",
  //   SURE_SHIELD_CORE_COMMISSION_3_YR: "",
  //   SURE_SHIELD_CORE_COMMISSION_4_YR: "",

  //   // Commission Structure - Max
  //   SURE_SHIELD_MAX_COMMISSION_1_YR: "",
  //   SURE_SHIELD_MAX_COMMISSION_2_YR: "",
  //   SURE_SHIELD_MAX_COMMISSION_3_YR: "",
  //   SURE_SHIELD_MAX_COMMISSION_4_YR: "",
  // }

  // const pdfBuffer = await generateAgreementPDF(dealerAgreementData as Record<string, string>)
  // const fileName = `dealership-agreements/${dealerId}-agreement-${Date.now()}.pdf`

  // const { error: agreementError } = await db.storage
  //   .from("dealership-agreements")
  //   .upload(fileName, pdfBuffer, {
  //     upsert: true,
  //     contentType: "application/pdf",
  //   })

  // if (agreementError) throw new Error("Failed to upload agreement: " + agreementError.message)

  // const { data: agreementData } = await db.storage
  //   .from("dealership-agreements")
  //   .getPublicUrl(fileName)

  return {
    success: true,
    message: "Dealer approved successfully",
    data: dealer,
  }
}

export const rejectDealerService = async (dealerId: string) => {
  const { data: dealer, error } = await db
    .from("dealers")
    .update({ status: "rejected" })
    .eq("id", dealerId)
    .select()
    .single()

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  return {
    success: true,
    message: "Dealer rejected successfully",
    data: dealer,
  }
}
