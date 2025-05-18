import { db } from "../../../config/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Response } from "express"
import { DealerEmployeeLoginInput } from "./team-auth.types"

export const loginDealerEmployeeService = async (body: DealerEmployeeLoginInput) => {
  const { employee_id, password } = body

  const { data: emp } = await db
    .from("dealer_employees")
    .select("id, name, employee_id, password, role, email, dealer:dealer_id(id, dealership_name)")
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
      id: emp.id,
      employee_id: emp.employee_id,
      name: emp.name,
      dealer_id: emp.dealer.id,
      dealership_name: emp.dealer.dealership_name,
      role: emp.role || "employee",
      email: emp.email || null,
      type: "employee",
    },
  }
}

export const getLoggedInDealerEmployeeService = async (id: string) => {
  const { data: emp } = await db
    .from("dealer_employees")
    .select("id, name, employee_id, role, email, dealer:dealer_id(id, dealership_name)")
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
      id: emp.id,
      employee_id: emp.employee_id,
      name: emp.name,
      dealer_id: emp.dealer.id,
      dealership_name: emp.dealer.dealership_name,
      role: emp.role || "employee",
      email: emp.email || null,
      type: "employee",
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
