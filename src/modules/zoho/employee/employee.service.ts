import { db } from "../../../config/db"
import bcrypt from "bcrypt"

export const onboardEmployeeService = async (payload: any) => {
  // Step 1: Generate Temporary Employee ID (Random 6-digit)
  const employee_id = Math.floor(100000 + Math.random() * 900000).toString()

  // Step 2: Generate Temporary Hashed Password
  const hashedPassword = await bcrypt.hash("Temp@1234", 10)

  // Step 3: Insert Employee (Pending Status, No Login Yet)

  const cleanedPayload = {
    ...payload,
    employee_id,
    password: hashedPassword,
    status: "pending",
  }

  const { data: employee, error } = await db
    .from("employees")
    .insert(cleanedPayload)
    .select()
    .single()

  await db.from("employee_roles").insert({
    employee_id: employee?.id,
    role_id: payload.role_id,
    assigned_by: payload.created_by,
  })

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  await db.from("audit_logs").insert({
    entity_type: "employee",
    reference_id: employee?.id!,
    action: "created",
    performed_by: payload.created_by,
    remarks: `HR submitted onboarding request for ${payload.first_name} ${payload.last_name}. Awaiting finance approval.`,
  })

  return {
    success: true,
    message: "Employee created successfully",
    data: employee,
  }
}
