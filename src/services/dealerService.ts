import bcrypt from "bcrypt"
import { db } from "../config/db"
import { DealerOnboardingPayload } from "../types/dealer.types"
import { generateDealerId, generateDealerEmployeeId } from "../utils/generateDealerId"

export const onboardDealerService = async (
  payload: DealerOnboardingPayload,
  createdBy: string
) => {
  try {
    const { dealer, finance_info, documents, employees, services, sub_dealerships } = payload
    const oem = dealer.oem?.toUpperCase()
    const dealer_id = await generateDealerId({
      state: dealer.state!,
      oemCode: oem?.substring(0, 3) || "DFL",
      isSubDealer: dealer.is_sub_dealer!,
      parentDealerId: dealer.parent_dealer_id ?? "",
    })

    // const tempPassword = crypto.randomBytes(6).toString("base64")
    const tempPassword = "Dealer@1234"
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    const { data: existingDealer } = await db
      .from("dealers")
      .select("id")
      .ilike("dealership_name", dealer.dealership_name!)
      .eq("city", dealer.city!)
      .eq("state", dealer.state!)
      .single()

    if (existingDealer) {
      return {
        success: false,
        status: 409,
        message: "Dealer already exists in this location.",
      }
    }

    const { data: insertedDealer, error: dealerError } = await db
      .from("dealers")
      .insert({
        dealership_type: dealer.dealership_type,
        dealership_name: dealer.dealership_name,
        registered_address: dealer.registered_address,
        city: dealer.city,
        state: dealer.state,
        pincode: dealer.pincode,
        gps_location: dealer.gps_location,
        operations_contact_name: dealer.operations_contact_name,
        operations_contact_phone: dealer.operations_contact_phone,
        email: dealer.email,
        owner_name: dealer.owner_name,
        owner_contact: dealer.owner_contact,
        owner_email: dealer.owner_email,
        escalation_name: dealer.escalation_name,
        escalation_email: dealer.escalation_email,
        escalation_contact: dealer.escalation_contact,
        pan_number: dealer.pan_number,
        gst_number: dealer.gst_number,
        password: hashedPassword,
        login_enabled: true,
        parent_dealer_id: dealer.parent_dealer_id ?? null,
        is_sub_dealer: dealer.is_sub_dealer,
        is_master_dealer: dealer.is_master_dealer,
        is_email_verified: dealer.is_email_verified,
        is_contact_verified: dealer.is_contact_verified,
        dealer_id,
        oem: oem,
        vehicle_types: dealer.vehicle_types,
        available_days: dealer.available_days,
        operation_location: dealer.operation_location,
        time_start: dealer.time_start,
        time_end: dealer.time_end,
        price_list_file: dealer.price_list_file,
        repair_on_site: dealer.repair_on_site,
        created_by: createdBy,
      })
      .select()
      .single()

    if (dealerError || !insertedDealer) {
      return {
        success: false,
        status: 500,
        message: "Failed to create dealer",
        error: dealerError?.message,
      }
    }

    const dealerId = insertedDealer.id

    await db.from("dealer_documents").insert({
      dealer_id: dealerId,
      ...documents,
    })

    await db.from("dealer_finance_info").insert({
      dealer_id: dealerId,
      ...finance_info,
    })

    const dealerEmpEmpPassword = "Dealer@1234"
    const dealerHashedPassword = await bcrypt.hash(dealerEmpEmpPassword, 10)
    if (employees?.length) {
      const employeeRecords = await Promise.all(
        employees.map(async (emp) => {
          const empId = await generateDealerEmployeeId(dealer_id)
          return {
            ...emp,
            name: `${emp.name}`,
            employee_id: empId,
            dealer_id: dealerId,
            password: dealerHashedPassword,
            login_enabled: false,
          }
        })
      )
      await db.from("dealer_employees").insert(employeeRecords)
    }

    // if new dealer is sub dealer, then we need to update the master dealer sub dealers table entry status to obnoard

    if (services?.length) {
      const serviceRecords = services.map((s) => ({
        dealer_id: dealerId,
        service_name: s.service_name,
        night_charge: s.night_charge,
        day_charge: s.day_charge,
        fixed_distance_charge: s.fixed_distance_charge,
        additional_price: s.additional_price,
      }))
      await db.from("dealer_services").insert(serviceRecords)
    }

    if (sub_dealerships?.length) {
      const subDealerRecords = sub_dealerships.map((sub) => ({
        dealer_id: dealerId,
        name: sub.name,
        contact: sub.contact,
        oem: sub.oem,
        address: sub.address,
      }))
      await db.from("dealer_sub_dealerships").insert(subDealerRecords)
    }

    await db.from("audit_logs").insert({
      entity_type: "dealer",
      reference_id: dealerId,
      action: "dealer_onboarding_requested",
      performed_by: createdBy,
      remarks: `Created onboarding request for ${dealer.dealership_name}`,
    })

    return {
      success: true,
      status: 201,
      message: "Dealer onboarded successfully",
      data: { dealer_id },
    }
  } catch (err: any) {
    console.error(err)
    return {
      success: false,
      status: 500,
      message: "Unexpected error",
      error: err.message,
    }
  }
}
