import { db } from "../../../config/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Response } from "express"
import { DealerEmployeeLoginInput } from "./team-auth.types"

export const loginDealerEmployeeService = async (body: DealerEmployeeLoginInput) => {
  const { employee_id, password } = body

  const { data: emp } = await db
    .from("dealer_employees")
    .select(
      "id, name, employee_id, password, role, email, dealer:dealer_id(id, dealership_name, oem)"
    )
    .eq("employee_id", employee_id)
    .single()

  if (!emp || !emp.password) {
    return {
      status: 401,
      success: false,
      message: "Invalid login credentials",
    }
  }

  const isMatch = await bcrypt.compare(password, emp.password)
  if (!isMatch) {
    return {
      status: 401,
      success: false,
      message: "Invalid login credentials",
    }
  }

  const token = jwt.sign(
    {
      id: emp.id,
      dealer_id: emp.dealer.id,
      is_dealer_employee: true,
      roles: ["employee"],
      permissions: [],
    },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" }
  )

  return {
    status: 200,
    success: true,
    message: "Login successful",
    token: token,
    data: {
      user: {
        id: emp.id,
        employee_id: emp.employee_id,
        name: emp.name,
        dealer_id: emp.dealer.id,
        dealership_name: emp.dealer.dealership_name,
        role: emp.role || "employee",
        email: emp.email || null,
        type: "employee",
        oem: emp.dealer.oem,
      },
      dealer_id: emp.dealer.id,
      sub_dealers: [],
      roles: ["employee"],
      permissions: [],
    },
  }
}

export const getLoggedInDealerEmployeeService = async (id: string) => {
  const { data: emp } = await db
    .from("dealer_employees")
    .select("id, name, employee_id, role, email, dealer:dealer_id(id, dealership_name, oem)")
    .eq("id", id)
    .single()

  if (!emp) {
    return {
      status: 404,
      success: false,
      message: "Employee not found",
    }
  }

  return {
    status: 200,
    success: true,
    message: "Employee profile loaded",
    data: {
      user: {
        id: emp.id,
        employee_id: emp.employee_id,
        name: emp.name,
        dealer_id: emp.dealer.id,
        dealership_name: emp.dealer.dealership_name,
        role: emp.role || "employee",
        type: "employee",
        email: emp.email || null,
        oem: emp.dealer.oem,
      },
      dealer_id: emp.dealer.id,
      sub_dealers: [],
      roles: ["employee"],
      permissions: [],
    },
  }
}

export const logoutDealerEmployeeService = async (res: Response) => {
  res.clearCookie("dealer_employee_token")
  return {
    status: 200,
    success: true,
    message: "Logout successful",
  }
}

export const resetDealerEmployeePasswordService = async (
  dealer_id: string,
  employee_id: string,
  new_password: string
) => {
  // check if employee exists
  const { data: employee, error: employeeError } = await db
    .from("dealer_employees")
    .select("id")
    .eq("id", employee_id)
    .eq("dealer_id", dealer_id)

  if (employeeError) {
    return {
      status: 500,
      success: false,
      message: employeeError.message,
    }
  }

  if (employee.length === 0) {
    return {
      status: 400,
      success: false,
      message: "Employee not found",
    }
  }

  // hash the new password
  const hashedPassword = await bcrypt.hash(new_password, 10)

  // update the password
  const { data, error } = await db
    .from("dealer_employees")
    .update({ password: hashedPassword })
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
    message: "Password reset successfully",
    data: data,
  }
}
