import { db } from "../../../config/db"
import bcrypt from "bcrypt"
import { generateDealerId, generateDealerEmployeeId } from "../../../utils/generateDealerId"

export const getDealerEmployeeByDealerIDService = async (dealer_id: string) => {
  const { data, error } = await db
    .from("dealer_employees")
    .select("id, employee_id, name, email, role, contact_number, created_at")
    .eq("dealer_id", dealer_id)
    .order("created_at", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Add dealer employee
export const addDealerEmployeeService = async (
  dealerId: string,
  dealer_id: string,
  name: string,
  email: string,
  role: string,
  contact_number: string
) => {
  try {
    // check if employee already exists with same name and phone number
    const { data: existingEmployee, error: existingEmployeeError } = await db
      .from("dealer_employees")
      .select("id")
      .eq("name", name)
      .eq("contact_number", contact_number)

    if (existingEmployeeError) {
      return {
        status: 400,
        success: false,
        message: existingEmployeeError.message,
      }
    }

    if (existingEmployee.length > 0) {
      return {
        status: 400,
        success: false,
        message: "Employee already exists with same name and phone number",
      }
    }

    const empId = await generateDealerEmployeeId(dealer_id)
    const dealerEmpEmpPassword = "Dealer@1234"
    const dealerHashedPassword = await bcrypt.hash(dealerEmpEmpPassword, 10)

    if (empId) {
      const record = {
        dealer_id: dealerId,
        name,
        role,
        contact_number,
        email,
        employee_id: empId,
        password: dealerHashedPassword,
        login_enabled: true,
      }

      const { data, error } = await db.from("dealer_employees").insert(record)

      if (error) {
        return {
          status: 500,
          success: false,
          message: error.message,
        }
      }
      return {
        status: 200,
        success: true,
        message: "Employee added successfully",
        data: data,
      }
    }
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message,
    }
  }
}

// Update dealer employee
export const updateDealerEmployeeService = async (
  dealer_id: string,
  employee_id: string,
  name: string,
  email: string,
  role: string,
  contact_number: string
) => {
  const { data, error } = await db
    .from("dealer_employees")
    .update({ name, email, role, contact_number })
    .eq("id", employee_id)
    .eq("dealer_id", dealer_id)

  if (error) {
    return {
      status: 500,
      success: false,
      message: error.message,
    }
  }

  return {
    status: 200,
    success: true,
    message: "Employee updated successfully",
    data: data,
  }
}

export const deleteDealerEmployeeService = async (dealer_id: string, employee_id: string) => {
  const { data, error } = await db
    .from("dealer_employees")
    .delete()
    .eq("id", employee_id)
    .eq("dealer_id", dealer_id)

  if (error) {
    return {
      status: 500,
      success: false,
      message: error.message,
    }
  }

  return {
    status: 200,
    success: true,
    message: "Employee deleted successfully",
    data: data,
  }
}

// Dealer can reset employee password
// Lets make api for this

export const resetDealerEmployeePasswordService = async (
  dealer_id: string,
  employee_id: string,
  password: string
) => {
  const { data: dealerEmployee, error: dealerEmployeeError } = await db
    .from("dealer_employees")
    .select("id")
    .eq("id", employee_id)
    .eq("dealer_id", dealer_id)

  if (dealerEmployeeError) {
    return {
      status: 400,
      success: false,
      message: "Employee not found",
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const { data, error } = await db
    .from("dealer_employees")
    .update({ password: hashedPassword })
    .eq("id", employee_id)
    .eq("dealer_id", dealer_id)

  if (error) {
    return {
      status: 400,
      success: false,
      message: error.message,
    }
  }

  return {
    status: 200,
    success: true,
    message: "Password reset successfully",
    data: data,
  }
}
