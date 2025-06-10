import { Request, Response } from "express"
import { db } from "../../../config/db"
import { ApiResponse } from "../../../types/apiResponse"
import bcrypt from "bcrypt"
import { createApprovalInstance } from "../approval/approval.service"
import { createNotification } from "../notification/notification.service"

export const getAllEmployees = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { data: employees, error } = await db
      .from("employees")
      .select(
        "id, employee_id, first_name, last_name, email, phone, dob, gender, status, department:department_id(id, name), created_by(id, first_name, last_name), created_at"
      )

    if (error) {
      return res.status(400).json({ success: false, message: "Error fetching employees." })
    }

    return res.json({
      success: true,
      message: "Employees retrieved successfully.",
      data: employees,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

// HR submits a new employee request
export const createEmployee = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      dob,
      gender,
      address,
      aadhar_id,
      pancard,
      bank_account,
      ifsc_code,
      emergency_contact,
      department_id,
      role_id,
      employment_type,
      salary,
      tax_deductions,
      provident_fund,
      reporting_manager,
    } = req.body

    const created_by = req.user?.id // HR ID

    if (!created_by) {
      return res.status(401).json({ success: false, message: "Unauthorized", data: created_by })
    }

    // Step 1: Generate Temporary Employee ID (Random 6-digit)
    const employee_id = Math.floor(100000 + Math.random() * 900000).toString()

    // Step 2: Generate Temporary Hashed Password
    const hashedPassword = await bcrypt.hash("Temp@1234", 10)

    // Step 3: Insert Employee (Pending Status, No Login Yet)
    const { data: employee, error } = await db
      .from("employees")
      .insert([
        {
          employee_id,
          password: hashedPassword,
          first_name,
          last_name,
          email,
          phone,
          dob,
          gender,
          address,
          aadhar_id,
          pancard,
          bank_account,
          ifsc_code,
          emergency_contact,
          department_id,
          role_id,
          employment_type: "full_time",
          salary,
          tax_deductions,
          provident_fund,
          reporting_manager,
          created_by,
          status: "pending", // Default status
        },
      ])
      .select()
      .single()

    await db.from("employee_roles").insert({
      employee_id: employee?.id,
      role_id: role_id,
      assigned_by: created_by,
    })

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create employee",
        error: error.message,
      })
    }

    // Step A: Get finance_head role_id dynamically
    const { data: financeRole } = await db
      .from("roles")
      .select("id")
      .eq("role", "finance_head")
      .single()

    if (!financeRole) {
      return res.status(500).json({ success: false, message: "Finance Head role not found." })
    }

    // Step B: Find an employee with that role
    const { data: financeHead } = await db
      .from("employee_roles")
      .select("employee_id")
      .eq("role_id", financeRole.id)
      .limit(1)
      .single()

    if (!financeHead) {
      return res.status(500).json({ success: false, message: "No Finance Head assigned yet." })
    }

    // if (financeHead) {
    //   const approval = await createApprovalInstance({
    //     approval_type_id: "54d21ddc-f4fd-4fc7-8f7f-f936494a757c",
    //     reference_id: employee.id,
    //     requested_by: created_by,
    //     metadata: {
    //       employee_name: `${first_name} ${last_name}`,
    //       department_id,
    //       role_id,
    //     },
    //   })

    //   // Step B: Notify Finance Head
    //   await createNotification({
    //     recipient_id: financeHead.employee_id!,
    //     sender_id: created_by!,
    //     type: "approval",
    //     message: `New onboarding request for ${first_name} ${last_name}`,
    //     reference_id: approval.id,
    //     metadata: {
    //       type: "employee_onboarding",
    //       reference_id: employee.id,
    //       step: 1,
    //     },
    //   })

    //   // Step C: Log Audit Trail
    //   await db.from("audit_logs").insert({
    //     entity_type: "employee",
    //     reference_id: employee.id!,
    //     action: "created",
    //     performed_by: created_by!,
    //     remarks: `HR submitted onboarding request for ${first_name} ${last_name}. Awaiting finance approval.`,
    //   })
    // }

    if (financeHead) {
      try {
        const approval = await createApprovalInstance({
          approval_type_id: "54d21ddc-f4fd-4fc7-8f7f-f936494a757c",
          reference_id: employee.id,
          requested_by: created_by,
          metadata: {
            employee_name: `${first_name} ${last_name}`,
            department_id,
            role_id,
          },
        })

        await createNotification({
          recipient_id: financeHead.employee_id!,
          sender_id: created_by!,
          type: "approval",
          message: `New onboarding request for ${first_name} ${last_name}`,
          reference_id: approval.id,
          metadata: {
            type: "employee_onboarding",
            reference_id: employee.id,
            step: 1,
          },
        })

        await db.from("audit_logs").insert({
          entity_type: "employee",
          reference_id: employee.id!,
          action: "created",
          performed_by: created_by!,
          remarks: `HR submitted onboarding request for ${first_name} ${last_name}. Awaiting finance approval.`,
        })
      } catch (err) {
        console.error("❌ Error during approval instance creation:", err)
        return res.status(500).json({
          success: false,
          message: "Failed to create approval workflow.",
          error: (err as any)?.message || "Unknown error",
        })
      }
    }

    return res.status(201).json({
      success: true,
      message: "Employee onboarding request submitted successfully.",
      data: employee,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error as string,
    })
  }
}

export const createEmployeeS = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      dob,
      gender,
      address,
      aadhar_id,
      pancard,
      bank_account,
      ifsc_code,
      emergency_contact,
      department_id,
      role_id,
      employment_type,
      salary,
      tax_deductions,
      provident_fund,
      reporting_manager,
    } = req.body

    const created_by = req.user?.id
    if (!created_by) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    // 🔐 Step 1: Generate employee_id & password
    const employee_id = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedPassword = await bcrypt.hash("Temp@1234", 10)

    // 👷 Step 2: Create Employee Record
    const { data: employee, error: employeeError } = await db
      .from("employees")
      .insert({
        employee_id,
        password: hashedPassword,
        first_name,
        last_name,
        email,
        phone,
        dob,
        gender,
        address,
        aadhar_id,
        pancard,
        bank_account,
        ifsc_code,
        emergency_contact,
        department_id,
        role_id,
        employment_type: employment_type || "full_time",
        salary,
        tax_deductions,
        provident_fund,
        reporting_manager,
        created_by,
        status: "pending",
      })
      .select()
      .single()

    if (employeeError || !employee) {
      return res.status(500).json({
        success: false,
        message: "Failed to create employee",
        error: employeeError?.message,
      })
    }

    // 👔 Step 3: Get Finance Head ID
    const { data: financeRole } = await db
      .from("roles")
      .select("id")
      .eq("role", "finance_head")
      .single()

    if (!financeRole) {
      return res.status(500).json({ success: false, message: "Finance Head role not found." })
    }

    const { data: financeHead } = await db
      .from("employee_roles")
      .select("employee_id")
      .eq("role_id", financeRole.id)
      .limit(1)
      .single()

    if (!financeHead) {
      return res.status(500).json({ success: false, message: "No Finance Head assigned." })
    }

    // ✅ Step 4: Create Approval
    await db.from("approvals").insert({
      request_type_id: "54d21ddc-f4fd-4fc7-8f7f-f936494a757c",
      reference_id: employee.id!,
      requested_by: created_by!,
      assigned_to: financeHead.employee_id!,
      approval_status: "pending",
      approval_stage: "finance",
      approval_comment: "",
    })

    // 🔔 Step 5: Send Notification to Finance Head
    await db.from("notifications").insert({
      recipient_id: financeHead.employee_id!,
      sender_id: created_by, // HR who created the employee
      type: "approval",
      message: `New onboarding request for ${first_name} ${last_name}.`,
      reference_id: employee.id,
      metadata: {
        employee_name: `${first_name} ${last_name}`,
        department_id: department_id,
        role_id: role_id,
        created_by: created_by,
        status: "pending",
      },
    })

    // 📜 Step 6: Add Audit Log
    await db.from("audit_logs").insert({
      entity_type: "employee",
      reference_id: employee.id,
      action: "created",
      performed_by: created_by,
      remarks: `HR submitted onboarding request for ${first_name} ${last_name}. Awaiting finance approval.`,
    })

    return res.status(201).json({
      success: true,
      message: "Employee onboarding request submitted successfully.",
      data: employee,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error as any,
    })
  }
}

export const getEmployeeRoles = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { employee_id } = req.params

    const { data, error } = await db
      .from("employee_roles")
      .select(`role_id, roles(id, role_name)`)
      .eq("employee_id", employee_id)

    if (error || !data) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch employee roles.", error: error.message })
    }

    const roles = data.map((r: any) => ({
      id: r.roles.id,
      role_name: r.roles.role_name,
    }))

    return res.json({
      success: true,
      message: "Employee roles retrieved successfully.",
      data: { employee_id, roles },
    })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error: error as string })
  }
}

// find employee by id, and as resposne return employee details like (first_name, last_name, employee_id) and role, department and permissions
// export const getEmployeeById = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
//   try {
//     const { employee_id } = req.params;
//       const { data, error } = await db
//       .from("employees")
//       .select(`
//         id,
//         first_name,
//         last_name,
//         employee_id,
//         roles:role_id(id, role_name),
//         departments:department_id(id, name)
//         `)
//       .eq("employee_id", employee_id);

//     if (error || !data) {
//       return res.status(500).json({ success: false, message: "Failed to fetch employee details.", error: error.message });
//     }

//     return res.json({ success: true, message: "Employee details fetched successfully.", data: data });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
//   }
// }

export const getEmployeeByEmplID = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { employee_id } = req.params

    if (!employee_id) {
      return res.status(400).json({ success: false, message: "Employee ID is required." })
    }

    const { data, error } = await db
      .from("employees")
      .select(
        `
        id,
        first_name,
        last_name,
        employee_id,
        department:department_id(id, name),
        roles:employee_roles!employee_id(
          role:role_id(
            id,
            role,
            role_name,
            description,
            permissions:role_permissions(
              permission:permission_id(
                id,
                name,
                category,
                description
              )
            )
          )
        )
      `
      )
      .eq("employee_id", employee_id)
      .single()

    if (error || !data) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch employee details.",
        error: error?.message ?? "No data returned",
      })
    }

    // 🧠 Flatten permissions
    const permissions =
      data.roles
        ?.flatMap((r: any) => r.role.permissions.map((p: any) => p.permission))
        .filter(Boolean) ?? []

    // 🧠 Flatten roles (just the role object)
    const roles = data.roles?.map((r: any) => r.role) ?? []

    // ✅ Final structured response
    const employee = {
      id: data.id,
      employee_id: data.employee_id,
      first_name: data.first_name,
      last_name: data.last_name,
      department: data.department,
      roles,
      permissions,
    }

    return res.json({
      success: true,
      message: "Employee details fetched successfully.",
      data: employee,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error as string,
    })
  }
}

export const getEmployeeById = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ success: false, message: "Employee ID is required." })
    }

    const { data, error } = await db
      .from("employees")
      .select(
        `
        id,
        first_name,
        last_name,
        employee_id,
        email,
        phone,
        dob,
        gender,
        aadhar_id,
        pancard,
        bank_account,
        ifsc_code,
        emergency_contact,
        department_id,
        employment_type,
        salary,
        tax_deductions,
        provident_fund,
        department:department_id(id, name),
        roles:employee_roles!employee_id(
  role:role_id(
    id,
    role,
    role_name,
    description,
    permissions:role_permissions(
      permission:permission_id(
        id,
        name,
        category,
        description
      )
    )
  )
)

      `
      )
      .eq("id", id)
      .single()

    if (error || !data) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch employee details.",
        error: error?.message ?? "No data returned",
      })
    }

    // 🧠 Flatten permissions
    const permissions = Array.isArray(data.roles)
      ? data.roles.flatMap((r: any) => r.role?.permissions?.map((p: any) => p.permission) || [])
      : []

    const roles = Array.isArray(data.roles) ? data.roles.map((r: any) => r.role) : []

    // ✅ Final structured response
    const employee = {
      id: data.id,
      employee_id: data.employee_id,
      department: data.department,
      personal: {
        first_name: data.first_name,
        last_name: data.last_name,
        dob: data.dob,
        gender: data.gender,
        email: data.email,
        phone: data.phone,
      },
      gov: {
        aadhar_id: data.aadhar_id,
        pancard: data.pancard,
      },
      payment: {
        account_number: data.bank_account,
        ifsc_code: data.ifsc_code,
        salary: data.salary,
        tax_deductions: data.tax_deductions,
        provident_fund: data.provident_fund,
      },
      roles,
      role: data.roles,
      permissions,
    }

    return res.json({
      success: true,
      message: "Employee details successfully.",
      data: employee,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error as string,
    })
  }
}

export const getEmployeeIdByRoleAndDepartment = async (role: string, department: string) => {
  // 1. Get the role ID
  const { data: roleData } = await db.from("roles").select("id").eq("role", role).single()

  if (!roleData) throw new Error(`Role '${role}' not found`)

  // 2. Get the department ID
  const { data: deptData } = await db
    .from("departments")
    .select("id")
    .eq("name", department)
    .single()

  if (!deptData) throw new Error(`Department '${department}' not found`)

  // 3. Get employee with matching role_id + department_id
  const { data: employee, error } = await db
    .from("employees")
    .select("id")
    .eq("role_id", roleData.id)
    .eq("department_id", deptData.id)
    .limit(1)
    .single()

  if (error) throw new Error(`Failed to find employee: ${error.message}`)
  if (!employee) throw new Error(`No employee found with role '${role}' in '${department}'`)

  return employee.id
}
