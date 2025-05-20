import { Request, Response } from "express"
import { generatePolicyPdf } from "../services/pdfService"
import { db } from "../config/db"

export const downloadPolicyPdfHandler = async (req: Request, res: Response) => {
  const { policy_number } = req.params

  const { data, error } = await db
    .from("rsa_plan_sales")
    .select(
      `
      policy_number, start_date, end_date, plan_duration_years,
      vehicles:vehicle_id (
        vehicle_model, vehicle_registration_number, chassis_number, engine_number,
        customers:customer_id (
          first_name, last_name, phone, address, city, state, postcode
        )
      ),
      rsa_plans:plan_id ( name )
    `
    )
    .eq("policy_number", policy_number)
    .maybeSingle()

  if (error || !data) {
    return res.status(404).json({ error: "Policy not found" })
  }

  const customer = data.vehicles.customers
  const vehicle = data.vehicles
  const plan = data.rsa_plans

  const buffer = await generatePolicyPdf({
    policy_number: data.policy_number,
    plan_name: plan.name,
    plan_duration: data.plan_duration_years.toString(),
    start_date: data.start_date,
    end_date: data.end_date,
    customer_name: `${customer.first_name} ${customer.last_name}`,
    phone: customer.phone,
    address: `${customer.address}, ${customer.city}, ${customer.state}, ${customer.postcode}`,
    vehicle_model: vehicle.vehicle_model,
    vehicle_number: vehicle.vehicle_registration_number,
    chassis_number: vehicle.chassis_number,
    engine_number: vehicle.engine_number,
  })

  console.log("PDF Buffer Size:", buffer.length)

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", `attachment; filename="${data.policy_number}.pdf"`)
  res.send(buffer)
}
