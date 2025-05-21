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
    const oems = dealer.oems?.map((oem) => oem.toUpperCase())
    const dealer_id = await generateDealerId({
      state: dealer.state!,
      oemCode: oems![0]!.substring(0, 3),
      isSubDealer: dealer.is_sub_dealer!,
      parentDealerId: dealer.parent_dealer_id!,
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
        parent_dealer_id: dealer.parent_dealer_id,
        is_sub_dealer: dealer.is_sub_dealer,
        is_master_dealer: dealer.is_master_dealer,
        is_email_verified: dealer.is_email_verified,
        is_contact_verified: dealer.is_contact_verified,
        dealer_id,
        oems: dealer.oems,
        vehicle_types: dealer.vehicle_types,
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

    if (services?.length) {
      const serviceRecords = services.map((s) => ({
        dealer_id: dealerId,
        operation_location: s.operation_location || "Main Office",
        service_name: s.service_name || "General Service",
        price_per_service: Number(s.price_per_service) || 0,
        price_per_km: Number(s.price_per_km) || 0,
        repair_on_site: s.repair_on_site,
        repair_price: Number(s.repair_price) || 0,
        night_price: Number(s.night_price) || 0,
        price_list_file: s.price_list_file,
        fixed_distance_charge: Number(s.fixed_distance_charge) || 0,
        is_24x7: s.is_24x7,
        time_start: s.time_start || null,
        time_end: s.time_end || null,
        available_days: s.available_days,
      }))

      await db.from("dealer_services").insert(serviceRecords)
    }

    if (sub_dealerships?.length) {
      const subDealerRecords = sub_dealerships.map((sub) => ({
        dealer_id: dealerId,
        name: sub.name,
        contact: sub.contact,
        oems: sub.oems,
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
