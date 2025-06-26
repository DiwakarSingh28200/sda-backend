import { db } from "../../../config/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Response } from "express"
import { LoginInput } from "./auth.types"

export const loginEmployeeService = async (body: LoginInput) => {
  const { email, password } = body

  const { data: employee, error: employeeError } = await db
    .from("employees")
    .select("id, employee_id, first_name, last_name, password, department:department_id(id, name)")
    .eq("email", email)
    .single()

  if (employeeError || !employee) {
    return {
      status: 401,
      success: false,
      message: "Invalid email or password.",
    }
  }

  if (!employee.password) {
    return {
      status: 400,
      success: false,
      message: "Employee password not set. Contact admin.",
    }
  }

  const isMatch = await bcrypt.compare(password, employee.password)
  if (!isMatch) {
    return {
      status: 401,
      success: false,
      message: "Invalid Employee ID or password.",
    }
  }

  const { data: roles } = await db
    .from("employee_roles")
    .select("role_id, roles(role, role_name)")
    .eq("employee_id", employee.id)

  if (!roles || roles.length === 0) {
    return {
      status: 403,
      success: false,
      message: "No roles assigned. Contact admin.",
    }
  }
  const roleIds = roles.map((r) => r.role_id)
  const roleNames = roles.map((r) => r.roles?.role_name.toLowerCase().split(" ").join("_") ?? "")

  const { data: permissions } = await db
    .from("role_permissions")
    .select("permission_id, permissions(name)")
    .in("role_id", roleIds)

  const permissionNames = permissions?.map((p) => p.permissions?.name ?? "") ?? []

  const token = jwt.sign(
    { id: employee.id, roles: roleNames, permissions: permissionNames },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" }
  )

  return {
    status: 200,
    success: true,
    message: "Login successful.",
    token: token,
    data: {
      employee: {
        id: employee.id,
        employee_id: employee.employee_id,
        name: `${employee.first_name} ${employee.last_name}`,
        department: employee.department,
      },
      roles: roleNames,
      permissions: permissionNames,
    },
  }
}

export const getAllEmployeesService = async () => {
  const { data, error } = await db.from("employees").select("*")
  if (error) {
    return {
      status: 500,
      success: false,
      message: "Error fetching employees.",
      error: error.message,
    }
  }

  return {
    status: 200,
    success: true,
    message: "Employees fetched successfully.",
    data,
  }
}

export const getLoggedInUserService = async (userId: string) => {
  // const { data: employee } = await db
  //   .from("employees")
  //   .select("id, employee_id, first_name, last_name, department:department_id(id, name)")
  //   .eq("id", userId)
  //   .single()

  // if (!employee) {
  //   return { status: 404, success: false, message: "User not found." }
  // }

  // const { data: roles } = await db
  //   .from("employee_roles")
  //   .select("role_id, roles(role, role_name)")
  //   .eq("employee_id", employee.id)

  // const roleIds = roles?.map((r) => r.role_id) ?? []
  // const roleNames = roles?.map((r) => r?.roles?.role_name.toLowerCase().split(" ").join("_")) ?? []

  // const { data: permissions } = await db
  //   .from("role_permissions")
  //   .select("permission_id, permissions(name)")
  //   .in("role_id", roleIds)

  // const permissionNames = permissions?.map((p) => p?.permissions?.name ?? "") ?? []

  // return {
  //   status: 200,
  //   success: true,
  //   message: "Employee retrieved successfully.",
  //   data: {
  //     employee: {
  //       id: employee.id,
  //       employee_id: employee.employee_id,
  //       name: `${employee.first_name} ${employee.last_name}`,
  //       department: employee.department,
  //     },
  //     roles: roleNames,
  //     permissions: permissionNames,
  //   },
  // }

  // Step 1: Fetch Employee Using `employee_id
  const { data: employee, error: employeeError } = await db
    .from("employees")
    .select("id, employee_id, first_name, last_name, department:department_id(id, name)")
    .eq("id", userId)
    .single()

  if (employeeError || !employee) {
    return {
      status: 404,
      success: false,
      message: "User not found.",
    }
  }

  // Step 2: Fetch Employee Roles (Using `id`, NOT `employee_id`)
  const { data: roles, error: rolesError } = await db
    .from("employee_roles")
    .select("role_id, roles(role, role_name)")
    .eq("employee_id", employee.id)

  if (rolesError || !roles.length) {
    return {
      success: false,
      message: "No roles assigned. Contact admin.",
      error: rolesError?.message,
      data: roles,
    }
  }

  const roleIds = roles.map((r: any) => r.role_id)
  const roleNames = roles.map((r: any) => r.roles.role_name.toLowerCase().split(" ").join("_"))

  // Step 4: Fetch Permissions Based on Roles (Using `role_id`)
  const { data: permissions, error: permissionsError } = await db
    .from("role_permissions")
    .select("permission_id, permissions(name)")
    .in("role_id", roleIds)

  // return res.status(200).json({ success: true, message: "Roles fetched successfully.", data: permissions });

  if (permissionsError) {
    return {
      success: false,
      message: "Error fetching permissions.",
      error: permissionsError?.message,
    }
  }

  const permissionNames = permissions.map((p: any) => p.permissions.name)

  return {
    status: 200,
    success: true,
    message: "Employee retrieved successfully.",
    data: {
      employee: {
        id: employee.id,
        employee_id: employee.employee_id,
        name: `${employee.first_name} ${employee.last_name}`,
        department: employee.department,
      },
      roles: roleNames,
      permissions: permissionNames,
    },
  }
}

export const logoutEmployeeService = async (res: Response) => {
  res.clearCookie("access_token")
  return {
    status: 200,
    success: true,
    message: "Logout successful.",
  }
}
