import { db } from "../config/db"
import bcrypt from "bcrypt"

const generatePolicyNumber = (
  stateCode: string,
  oemCode: string,
  serial: number,
  planCode: string
) => {
  const year = new Date().getFullYear().toString().slice(-2)
  const serialStr = serial.toString().padStart(6, "0")
  return `${stateCode}${oemCode}${serialStr}${year}${planCode}`
}

export const createCustomer = async (input: any) => {
  const { customer, vehicle, rsa_plan, login } = input

  let customer_id: string | null = null
  let vehicle_id: string | null = null

  try {
    // 1️⃣ Insert Customer
    const { data: cust, error: customerErr } = await db
      .from("customers")
      .insert([customer])
      .select()
      .single()
    if (customerErr) throw new Error("Customer insert failed: " + customerErr.message)
    customer_id = cust.id

    // 2️⃣ Insert Vehicle
    const vehiclePayload = { ...vehicle, customer_id }
    const { data: veh, error: vehicleErr } = await db
      .from("vehicles")
      .insert([vehiclePayload])
      .select()
      .single()
    if (vehicleErr) throw new Error("Vehicle insert failed: " + vehicleErr.message)
    vehicle_id = veh.id

    // 3️⃣ Generate Policy Number
    const serialNumber = Math.floor(Math.random() * 1000000)
    const oemCode = vehicle.vehicle_company?.slice(0, 3).toUpperCase() || "OEM"
    const planCodeMap = { basic: "B", standard: "S", premium: "P", elite: "E" }
    const planCode =
      planCodeMap[rsa_plan.plan_type?.toLowerCase() as keyof typeof planCodeMap] || "B"
    const policyNumber = generatePolicyNumber(
      customer.state.slice(0, 2).toUpperCase(),
      oemCode,
      serialNumber,
      planCode
    )

    const endDate = new Date(rsa_plan.start_date)
    endDate.setFullYear(endDate.getFullYear() + rsa_plan.plan_duration_years)

    // 4️⃣ Insert RSA Plan Sale
    const rsaPayload = {
      vehicle_id,
      plan_id: rsa_plan.plan_id,
      plan_duration_years: rsa_plan.plan_duration_years,
      start_date: rsa_plan.start_date,
      end_date: endDate.toISOString().slice(0, 10),
      paid_amount: rsa_plan.plan_price,
      policy_number: policyNumber,
      dealer_id: vehicle.dealer_id,
      sales_by: rsa_plan.sales_by,
    }

    const { error: planErr } = await db.from("rsa_plan_sales").insert([rsaPayload])
    if (planErr) throw new Error("RSA Plan insert failed: " + planErr.message)

    // 5️⃣ Insert Login
    const hashedPassword = await bcrypt.hash("Welcome@123", 10)
    const { error: loginErr } = await db.from("customer_logins").insert([
      {
        customer_id,
        phone: customer.phone,
        password_hash: hashedPassword,
        otp_verified: false,
      },
    ])
    if (loginErr) throw new Error("Login insert failed: " + loginErr.message)

    return {
      customer_id,
      policy_number: policyNumber,
    }
  } catch (err: any) {
    // 🔥 ROLLBACK manually
    console.log("err: ", err)
    if (vehicle_id) {
      await db.from("vehicles").delete().eq("id", vehicle_id)
    }
    if (customer_id) {
      await db.from("customers").delete().eq("id", customer_id)
    }

    return {
      success: false,
      message: "Something went wrong",
      error: err,
    }
  }
}
