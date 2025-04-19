import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { db } from "../config/db"
import { DealerOnboardingPayload } from "../types/dealer.type"
import { generateDealerEmployeeId, generateDealerId } from "../utils/idGenerators"
import { getEmployeeIdByRoleAndDepartment } from "./employeesController"

export const onboardDealer = async (
  req: Request<{}, {}, DealerOnboardingPayload>,
  res: Response
) => {
  try {
    const { dealer, finance_info, documents, oems, employees, services, sub_dealerships } =
      req.body

    const requiredDealerFields: (keyof typeof dealer)[] = [
      "dealership_type",
      "dealership_name",
      "registered_address",
      "city",
      "state",
      "pincode",
      "operations_contact_name",
      "operations_contact_phone",
      "email",
      "owner_name",
      "owner_contact",
      "owner_email",
      "escalation_name",
      "escalation_contact",
      "escalation_email",
      "pan_number",
      "gst_number",
      "support_contact",
    ]

    const missingFields = requiredDealerFields.filter((field) => !dealer[field])
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        error: `Missing: ${missingFields.join(", ")}`,
      })
    }

    if (!oems?.length || oems.some((o) => !o.oem_name || !o.vehicle_segment)) {
      return res.status(400).json({
        success: false,
        message: "OEM validation failed",
        error: "Each OEM must include 'oem_name' and 'vehicle_segment'.",
      })
    }

    const createdBy = (req as any).user?.id

    const defaultPassword = "Dealer@123"
    const username = generateDealerId()
    const dealerNumeric = username.replace("DLR", "")
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)

    // Check for duplicate dealer by name + location
    const { data: existingDealer } = await db
      .from("dealers")
      .select("id")
      .ilike("dealership_name", dealer.dealership_name!) // case-insensitive
      .eq("city", dealer.city!)
      .eq("state", dealer.state!)
      .single()

    if (existingDealer) {
      return res.status(409).json({
        success: false,
        message: "A dealer with the same name and location already exists",
        error: "Duplicate dealer entry",
      })
    }

    const { error: dealerError, data: insertedDealer } = await db
      .from("dealers")
      .insert({ ...dealer, created_by: createdBy, username, password: hashedPassword })
      .select()
      .single()

    if (dealerError || !insertedDealer) {
      return res.status(500).json({
        success: false,
        message: "Failed to insert dealer",
        error: dealerError?.message,
      })
    }

    const dealerId = insertedDealer.id!

    // Insert document metadata (now includes file URLs only)
    await db.from("dealer_documents").insert({
      dealer_id: dealerId,
      gst_certificate: documents.gst_certificate,
      pan_card_file: documents.pan_card_file,
      address_proof: documents.address_proof,
      incorporation_certificate: documents.incorporation_certificate,
    })

    await db.from("dealer_finance_info").insert({
      dealer_id: dealerId,
      bank_name: finance_info.bank_name,
      account_number: finance_info.account_number,
      ifsc_code: finance_info.ifsc_code,
      finance_contact_name: finance_info.finance_contact_name,
      finance_contact_email: finance_info.finance_contact_email,
      finance_contact_phone: finance_info.finance_contact_phone,
      cancelled_cheque_file: finance_info.cancelled_cheque_file,
    })

    await db.from("dealer_oems").insert(oems.map((oem) => ({ ...oem, dealer_id: dealerId })))

    if (employees?.length) {
      const employeeRecords = await Promise.all(
        employees.map(async (emp) => {
          const empId = generateDealerEmployeeId(dealerNumeric)
          const password = Math.random().toString(36).slice(-10)
          const hashed = await bcrypt.hash(password, 10)
          return {
            ...emp,
            id: empId,
            dealer_id: dealerId,
            username: empId,
            password: hashed,
            login_enabled: true,
            created_at: new Date().toISOString(),
          }
        })
      )
      await db.from("dealer_employees").insert(employeeRecords)
    }

    if (services?.length) {
      await db.from("dealer_services").insert(services.map((s) => ({ ...s, dealer_id: dealerId })))
    }

    if (sub_dealerships?.length) {
      await db
        .from("dealer_sub_dealerships")
        .insert(sub_dealerships.map((s) => ({ ...s, dealer_id: dealerId })))
    }

    // 🔁 Get approval type (based on name, not code)
    const { data: approvalType } = await db
      .from("approval_types")
      .select("id")
      .eq("name", "dealer_onboarding")
      .single()

    if (!approvalType) {
      throw new Error("Approval type 'Dealer Onboarding' not found")
    }

    // 🔁 Get approval flow step
    const { data: flow } = await db
      .from("approval_flows")
      .select("*")
      .eq("approval_type_id", approvalType.id)
      .eq("step_number", 1)
      .single()

    if (!flow) {
      throw new Error("Dealer approval flow not found")
    }

    // // ✅ Approver: Regional Sales Lead
    // const { data: approver } = await db
    //   .from("employees")
    //   .select("id, roles!inner(role), departments!inner(name)")
    //   .eq("roles.role", "regional_sales_lead")
    //   .eq("departments.name", "sales")
    //   .single()

    // console.log("approver: ", approver)

    const approverId = await getEmployeeIdByRoleAndDepartment("regional_sales_lead", "sales")
    console.log("approverId: ", approverId)
    if (!approverId) throw new Error("Regional Sales Lead not found")

    // ✅ Create approval instance
    const { data: instance, error: intanceError } = await db
      .from("approval_instances")
      .insert({
        approval_type_id: "ab381f9d-dbb3-4ffc-a855-7be9300c6b7b",
        reference_id: dealerId,
        requested_by: createdBy,
        current_step: 1,
        status: "pending",
        metadata: {
          dealer_name: dealer.dealership_name,
          city: dealer.city,
          state: dealer.state,
        },
      })
      .select()
      .single()

    if (!instance) throw new Error(`Instance not inserted`)

    // ✅ Create approval step
    await db.from("approval_steps").insert({
      instance_id: instance.id!,
      step_number: 1,
      role: "regional_sales_lead",
      assigned_to: approverId!,
      status: "pending",
    })

    // ✅ Notify approver
    await db.from("notifications").insert({
      recipient_id: approverId!,
      sender_id: createdBy,
      type: "approval",
      reference_id: dealerId,
      message: `New dealer onboarding request: ${dealer.dealership_name}`,
      metadata: {
        module: "dealer",
        reference_id: dealerId,
        action: "dealer_onboarding_requested",
        label: dealer.dealership_name,
      },
    })

    // ✅ Log audit
    await db.from("audit_logs").insert({
      entity_type: "dealer",
      reference_id: dealerId,
      action: "dealer_onboarding_requested",
      performed_by: createdBy,
      remarks: `Created onboarding request for ${dealer.dealership_name}`,
    })

    return res.status(201).json({
      success: true,
      message: "Dealer onboarded successfully",
      data: { dealer_id: dealerId },
    })
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Dealer onboarding failed",
      error: err.message,
    })
  }
}

export const getAllDealers = async (req: Request, res: Response) => {
  try {
    const { data, error } = await db
      .from("dealers")
      .select(
        "id, dealership_name, dealership_type, city, state, owner_name, operations_contact_phone, email,login_enabled,created_at"
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
