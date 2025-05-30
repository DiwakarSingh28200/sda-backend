import { db } from "../../../config/db"
import bcrypt from "bcrypt"
import { generateDealerId, generateDealerEmployeeId } from "../../../utils/generateDealerId"

export const getDealerEmployeeByDealerIDService = async (dealer_id: string) => {
  const { data, error } = await db
    .from("dealer_employees")
    .select("id, employee_id, name, email, role, contact_number, created_at")
    .eq("dealer_id", dealer_id)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Add dealer employee
export const addDealerEmployeeService = async (
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
        dealer_id,
        name,
        role,
        contact_number,
        email,
        employee_id: empId,
        password: dealerHashedPassword,
        login_enabled: true,
      }
      console.log("record", record)
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
  try {
    const { data, error } = await db
      .from("dealer_employees")
      .update({ name, email, role, contact_number })
      .eq("dealer_id", dealer_id)
      .eq("employee_id", employee_id)

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
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message,
    }
  }
}

export const deleteDealerEmployeeService = async (dealer_id: string, employee_id: string) => {
  const { data, error } = await db
    .from("dealer_employees")
    .delete()
    .eq("dealer_id", dealer_id)
    .eq("employee_id", employee_id)

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
