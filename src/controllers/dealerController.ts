import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { db } from "../config/db"
import { DealerOnboardingPayload } from "../types/dealer.type"
import { generateDealerEmployeeId, generateDealerId } from "../utils/idGenerators"
import { DealerOnboardingSchema } from "../types/schemas/dealer.schema"
import { onboardDealerService } from "../services/dealerService"

// export const onboardDealer = async (
//   req: Request<{}, {}, DealerOnboardingPayload>,
//   res: Response
// ) => {
//   try {
//     const { dealer, finance_info, documents, oems, employees, services, sub_dealerships } =
//       req.body

//     const requiredDealerFields: (keyof typeof dealer)[] = [
//       "dealership_type",
//       "dealership_name",
//       "registered_address",
//       "city",
//       "state",
//       "pincode",
//       "operations_contact_name",
//       "operations_contact_phone",
//       "email",
//       "owner_name",
//       "owner_contact",
//       "owner_email",
//       "escalation_name",
//       "escalation_contact",
//       "escalation_email",
//       "pan_number",
//       "gst_number",
//       "support_contact",
//     ]

//     const missingFields = requiredDealerFields.filter((field) => !dealer[field])
//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//         error: `Missing: ${missingFields.join(", ")}`,
//       })
//     }

//     if (!oems?.length || oems.some((o) => !o.oem_name || !o.vehicle_segment)) {
//       return res.status(400).json({
//         success: false,
//         message: "OEM validation failed",
//         error: "Each OEM must include 'oem_name' and 'vehicle_segment'.",
//       })
//     }

//     const createdBy = (req as any).user?.id

//     const defaultPassword = "Dealer@123"
//     const username = generateDealerId()
//     const dealerNumeric = username.replace("DLR", "")
//     const hashedPassword = await bcrypt.hash(defaultPassword, 10)

//     // Check for duplicate dealer by name + location
//     const { data: existingDealer } = await db
//       .from("dealers")
//       .select("id")
//       .ilike("dealership_name", dealer.dealership_name!) // case-insensitive
//       .eq("city", dealer.city!)
//       .eq("state", dealer.state!)
//       .single()

//     if (existingDealer) {
//       return res.status(409).json({
//         success: false,
//         message: "A dealer with the same name and location already exists",
//         error: "Duplicate dealer entry",
//       })
//     }

//     const { error: dealerError, data: insertedDealer } = await db
//       .from("dealers")
//       .insert({
//         ...dealer,
//         created_by: createdBy,
//         dealer_id: username,
//         password: hashedPassword,
//         login_enabled: true,
//       })
//       .select()
//       .single()

//     if (dealerError || !insertedDealer) {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to insert dealer",
//         error: dealerError?.message,
//       })
//     }

//     const dealerId = insertedDealer.id!

//     // Insert document metadata (now includes file URLs only)
//     await db.from("dealer_documents").insert({
//       dealer_id: dealerId,
//       gst_certificate: documents.gst_certificate,
//       pan_card_file: documents.pan_card_file,
//       address_proof: documents.address_proof,
//       incorporation_certificate: documents.incorporation_certificate,
//     })

//     await db.from("dealer_finance_info").insert({
//       dealer_id: dealerId,
//       bank_name: finance_info.bank_name,
//       account_number: finance_info.account_number,
//       ifsc_code: finance_info.ifsc_code,
//       finance_contact_name: finance_info.finance_contact_name,
//       finance_contact_email: finance_info.finance_contact_email,
//       finance_contact_phone: finance_info.finance_contact_phone,
//       cancelled_cheque_file: finance_info.cancelled_cheque_file,
//     })

//     await db.from("dealer_oems").insert(oems.map((oem) => ({ ...oem, dealer_id: dealerId })))

//     if (employees?.length) {
//       const employeeRecords = await Promise.all(
//         employees.map(async (emp) => {
//           const empId = generateDealerEmployeeId(dealerNumeric)
//           const password = Math.random().toString(36).slice(-10)
//           const hashed = await bcrypt.hash(password, 10)
//           return {
//             ...emp,
//             id: empId,
//             dealer_id: dealerId,
//             username: empId,
//             password: hashed,
//             login_enabled: true,
//             created_at: new Date().toISOString(),
//           }
//         })
//       )
//       await db.from("dealer_employees").insert(employeeRecords)
//     }

//     if (services?.length) {
//       await db.from("dealer_services").insert(services.map((s) => ({ ...s, dealer_id: dealerId })))
//     }

//     if (sub_dealerships?.length) {
//       await db
//         .from("dealer_sub_dealerships")
//         .insert(sub_dealerships.map((s) => ({ ...s, dealer_id: dealerId })))
//     }

//     // ✅ Log audit
//     await db.from("audit_logs").insert({
//       entity_type: "dealer",
//       reference_id: dealerId,
//       action: "dealer_onboarding_requested",
//       performed_by: createdBy,
//       remarks: `Created onboarding request for ${dealer.dealership_name}`,
//     })

//     return res.status(201).json({
//       success: true,
//       message: "Dealer onboarded successfully",
//       data: { dealer_id: dealerId },
//     })
//   } catch (err: any) {
//     return res.status(500).json({
//       success: false,
//       message: "Dealer onboarding failed",
//       error: err.message,
//     })
//   }
// }

const humanizeKey = (path: string[]) => {
  const field = path[path.length - 1]
  return field
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, l => l.toUpperCase()) // capitalize
}

export const onboardDealerHandler = async (req: Request, res: Response) => {
  const parsed = DealerOnboardingSchema.safeParse(req.body)

  if (!parsed.success) {
    const messages: string[] = []
    for (const issue of parsed.error.issues) {
      const label = humanizeKey(issue.path as string[])
      messages.push(`${label}: ${issue.message}`)
    }

    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    })
  }
  const createdBy = (req as any).user?.id

  const result = await onboardDealerService(parsed.data, createdBy)
  return res.status(result.status).json(result)
}

export const getAllDealers = async (req: Request, res: Response) => {
  try {
    const { data, error } = await db
      .from("dealers")
      .select(
        "id, dealership_name, dealership_type, city, state, owner_name, operations_contact_phone, dealer_id, email,login_enabled,created_at"
      )
      .order("created_at", { ascending: false })

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch dealers",
        error: error.message,
      })
    }

    return res.status(200).json({
      success: true,
      message: "Dealer list fetched successfully",
      data,
    })
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    })
  }
}

export const getDealerByDealerID = async (req: Request, res: Response) => {
  try {
    const { dealer_id } = req.params
    const { data, error } = await db
      .from("dealers")
      .select(
        "id, dealer_id,dealership_name,dealership_type,city,state,owner_name,operations_contact_phone,email,created_at"
      )
      .eq("dealer_id", dealer_id)
      .single()
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch dealer",
        error: error.message,
      })
    }

    return res.status(200).json({
      success: true,
      message: "Dealer fetched successfully",
      data,
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
export const getDealerProfileById = async (req: Request, res: Response) => {
  const { dealer_id } = req.params
  try {
    const { data: dealerData, error } = await db
      .from("dealers")
      .select(
        `
        *,
        documents:dealer_documents(*),
        employees:dealer_employees(name, role, contact_number, email),
        finance_info:dealer_finance_info(*),
        services:dealer_services(*),
        sub_dealerships:dealer_sub_dealerships(*)
      `
      )
      .eq("dealer_id", dealer_id)
      .single()

    if (!dealerData && error) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      })
    }

    // Restructure the response
    const response = {
      dealer: {
        id: dealerData.id,
        dealership_type: dealerData.dealership_type,
        dealership_name: dealerData.dealership_name,
        registered_address: dealerData.registered_address,
        city: dealerData.city,
        state: dealerData.state,
        pincode: dealerData.pincode,
        gps_location: dealerData.gps_location,
        operations_contact_name: dealerData.operations_contact_name,
        operations_contact_phone: dealerData.operations_contact_phone,
        email: dealerData.email,
        owner_name: dealerData.owner_name,
        owner_contact: dealerData.owner_contact,
        owner_email: dealerData.owner_email,
        escalation_name: dealerData.escalation_name,
        escalation_contact: dealerData.escalation_contact,
        escalation_email: dealerData.escalation_email,
        pan_number: dealerData.pan_number,
        gst_number: dealerData.gst_number,
        dealer_id: dealerData.dealer_id,
        login_enabled: dealerData.login_enabled,
        created_by: dealerData.created_by,
        created_at: dealerData.created_at,
        parent_dealer_id: dealerData.parent_dealer_id,
        is_sub_dealer: dealerData.is_sub_dealer,
        is_master_dealer: dealerData.is_master_dealer,
        is_email_verified: dealerData.is_email_verified,
        is_contact_verified: dealerData.is_contact_verified,
        vehicle_types: dealerData.vehicle_types,
        oems: dealerData.oems,
      },
      documents: dealerData?.documents[0],
      finance_info: dealerData.finance_info[0],
      employees: dealerData.employees,
      sub_dealerships: dealerData.sub_dealerships,
      oems: dealerData.oems,
    }

    return res.status(200).json({
      success: true,
      message: "Dealer found",
      data: response,
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
