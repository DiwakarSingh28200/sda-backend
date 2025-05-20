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

export const onboardDealerHandler = async (req: Request, res: Response) => {
  const parsed = DealerOnboardingSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: parsed.error.flatten().fieldErrors,
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
