import { db } from "../../../config/db"
import bcrypt from "bcrypt"
import {
  CustomerInsert,
  VehicleInsert,
  RsaPlanSaleInsert,
  CustomerLoginInsert,
  CustomerOnboardInput,
} from "./customers.types"
import { STATE_CODE_MAP } from "../../../utils/generateDealerId"

const generatePolicyNumber = (
  state: string,
  oemCode: string,
  serial: number,
  planCode: string
) => {
  const year = new Date().getFullYear().toString().slice(-2)
  const serialStr = serial.toString().padStart(6, "0")
  const normalizedState = state
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())

  const stateCode = STATE_CODE_MAP[normalizedState]
  return `${stateCode}${oemCode}${serialStr}${year}${planCode}`
}

export const createCustomerService = async (
  input: CustomerOnboardInput,
  dealerEmployeeId: string
): Promise<{
  status: number
  success: boolean
  message: string
  data?: any
}> => {
  const { customer, vehicle, rsa_plan } = input
  let customer_id: string | null = null
  let vehicle_id: string | null = null

  try {
    // check if customer already exists and the buy the same plan send error
    const { data: existingCustomer } = await db
      .from("customers")
      .select("id")
      .eq("phone", customer.phone)
      .single()

    if (existingCustomer?.id) {
      const { data: customerCurrentPlan } = await db
        .from("rsa_plan_sales")
        .select("id, vehicle_id, plan_id, vehicles!inner(customer_id)")
        .eq("vehicles.customer_id", existingCustomer.id)
        .eq("plan_id", rsa_plan.plan_id)
        .maybeSingle()

      if (customerCurrentPlan) {
        return {
          status: 400,
          success: false,
          message: "Customer already purchased this plan",
        }
      }
    }

    const { data: employee, error: empErr } = await db
      .from("dealer_employees")
      .select("dealer_id, id")
      .eq("id", dealerEmployeeId)
      .single()
    if (empErr || !employee) throw new Error("Dealer employee not found")

    const { data: cust, error: customerErr } = await db
      .from("customers")
      .insert({
        ...customer,
        dealer_id: employee.dealer_id,
      })
      .select()
      .single()
    if (customerErr)
      throw new Error("Customer insert failed: " + customerErr.message)
    customer_id = cust.id

    const vehiclePayload = {
      ...vehicle,
      customer_id,
      dealer_id: employee.dealer_id,
    }
    const { data: veh, error: vehicleErr } = await db
      .from("vehicles")
      .insert([vehiclePayload])
      .select()
      .single()
    if (vehicleErr)
      throw new Error("Vehicle insert failed: " + vehicleErr.message)
    vehicle_id = veh.id

    const serialNumber = Math.floor(Math.random() * 1000000)
    const oemCode = vehicle.vehicle_company?.slice(0, 3).toUpperCase() || "OEM"

    const { data: plan } = await db
      .from("rsa_plans")
      .select("name")
      .eq("id", rsa_plan.plan_id)
      .single()

    const planCodeMap = { standard: "S", premium: "P", elite: "E" }
    const planCode =
      planCodeMap[plan?.name.toLowerCase() as keyof typeof planCodeMap] || "S"

    const policyNumber = generatePolicyNumber(
      customer.state,
      oemCode,
      serialNumber,
      planCode
    )

    const rsaPayload: RsaPlanSaleInsert = {
      vehicle_id,
      plan_id: rsa_plan.plan_id,
      plan_duration_years: Number(rsa_plan.plan_duration_years),
      start_date: rsa_plan.start_date,
      end_date: rsa_plan.end_date,
      paid_amount: Number(rsa_plan.paid_amount),
      policy_number: policyNumber,
      dealer_id: employee.dealer_id,
      sales_by: employee.id,
      status: "active",
    }

    const { error: planErr } = await db
      .from("rsa_plan_sales")
      .insert([rsaPayload])
    if (planErr) throw new Error("RSA Plan insert failed: " + planErr.message)

    const hashedPassword = await bcrypt.hash("Welcome@123", 10)
    const loginPayload: CustomerLoginInsert = {
      customer_id,
      phone: customer.phone,
      password_hash: hashedPassword,
      otp_verified: false,
    }

    const { error: loginErr } = await db
      .from("customer_logins")
      .insert([loginPayload])
    if (loginErr) throw new Error("Login insert failed: " + loginErr.message)

    return {
      status: 201,
      success: true,
      message: "Customer onboarded successfully",
      data: {
        customer_id,
        policy_number: policyNumber,
      },
    }
  } catch (err: any) {
    if (vehicle_id) await db.from("vehicles").delete().eq("id", vehicle_id)
    if (customer_id) await db.from("customers").delete().eq("id", customer_id)
    return {
      status: 500,
      success: false,
      message: "Onboarding failed: " + err.message,
    }
  }
}

export const getAllCustomersService = async () => {
  try {
    const { data, error } = await db.from("customers").select("*")
    if (error) throw new Error("Customers fetch failed: " + error.message)
    return data
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: "Getting Data failed: " + error.message,
    }
  }
}
