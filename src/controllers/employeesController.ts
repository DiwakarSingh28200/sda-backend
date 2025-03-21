import { Request, Response } from "express";
import { db } from "../config/db";
import { ApiResponse } from "../types/apiResponse";
import bcrypt from "bcrypt";
import { CreateEmployeeRequest } from "../types/employeRequest";

export const getAllEmployees = async (
  req: Request,
  res: Response<ApiResponse<any>>,
): Promise<Response> => {
  try {
    const { data: employees, error } = await db
      .from("employees")
      .select(
        "id, employee_id, first_name, last_name, email, phone, dob, gender, status, department:department_id(id, name), created_by(id, first_name, last_name), created_at",
      );

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: "Error fetching employees." });
    }

    return res.json({
      success: true,
      message: "Employees retrieved successfully.",
      data: employees,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error.",
        error: error instanceof Error ? error.message : "Unknown error",
      });
  }
};

// HR submits a new employee request
export const createEmployee = async (
  req: Request,
  res: Response<ApiResponse<any>>,
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
    } = req.body;

    const created_by = req.user?.id; // HR ID

    if (!created_by) {
      return res.status(401).json({ success: false, message: "Unauthorized", data: created_by });
    }

    // Step 1: Generate Temporary Employee ID (Random 6-digit)
    const employee_id = Math.floor(100000 + Math.random() * 900000).toString();

    // Step 2: Generate Temporary Hashed Password
    const hashedPassword = await bcrypt.hash("Temp@1234", 10);

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
      .single();

    if (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to create employee",
          error: error.message,
        });
    }

    // Step A: Get finance_head role_id dynamically
const { data: financeRole } = await db
.from("roles")
.select("id")
.eq("role", "finance_head")
.single();

if (!financeRole) {
return res.status(500).json({ success: false, message: "Finance Head role not found." });
}

// Step B: Find an employee with that role
const { data: financeHead } = await db
  .from("employee_roles")
  .select("employee_id")
  .eq("role_id", financeRole.id)
  .limit(1)
  .single();

if (!financeHead) {
  return res.status(500).json({ success: false, message: "No Finance Head assigned yet." });
}


    // Step 3: Notify Finance Head
    // const financeHead = await db
    //   .from("employees")
    //   .select("id")
    //   .eq("role_id", "finance_head")
    //   .single();


    // if (financeHead) {
    //   await db.from("notifications").insert([
    //     {
    //       recipient_id: financeHead.employee_id,
    //       message: `New employee onboarding request for ${first_name} ${last_name}. Please review.`,
    //       type: "approval",
    //     },
    //   ]);
    // }

    // Step C: Use it in approval assignment
    // Step 2: Create Approval Request (For Finance Head)


if (financeHead) {

  await db.from("approvals").insert({
    request_type_id: "54d21ddc-f4fd-4fc7-8f7f-f936494a757c",
    reference_id: employee.id!,
    requested_by: created_by!,
    assigned_to: financeHead.employee_id!, 
    approval_status: "pending",
    approval_stage: "finance",
    approval_comment: "",
  });

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
      status: "pending"
    },
  });

  // Step 4: Log the Request in `audit_logs`

  await db.from("audit_logs").insert({
    entity_type: "employee",
    reference_id: employee.id!,
    action: "created",
    performed_by: created_by!,
    remarks: `HR submitted onboarding request for ${first_name} ${last_name}. Awaiting finance approval.`,
  });

}

    
   
    return res
      .status(201)
      .json({
        success: true,
        message: "Employee onboarding request submitted successfully.",
        data: employee,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error.",
        error: error as string,
      });
  }
};


export const createEmployeeS = async (
  req: Request,
  res: Response<ApiResponse<any>>,
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
    } = req.body;

    const created_by = req.user?.id;
    if (!created_by) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 🔐 Step 1: Generate employee_id & password
    const employee_id = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash("Temp@1234", 10);

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
      .single();

    if (employeeError || !employee) {
      return res.status(500).json({
        success: false,
        message: "Failed to create employee",
        error: employeeError?.message,
      });
    }

    // 👔 Step 3: Get Finance Head ID
    const { data: financeRole } = await db
      .from("roles")
      .select("id")
      .eq("role", "finance_head")
      .single();

    if (!financeRole) {
      return res.status(500).json({ success: false, message: "Finance Head role not found." });
    }

    const { data: financeHead } = await db
      .from("employee_roles")
      .select("employee_id")
      .eq("role_id", financeRole.id)
      .limit(1)
      .single();

    if (!financeHead) {
      return res.status(500).json({ success: false, message: "No Finance Head assigned." });
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
    });

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
      status: "pending"
    },
    });

    // 📜 Step 6: Add Audit Log
    await db.from("audit_logs").insert({
      entity_type: "employee",
      reference_id: employee.id,
      action: "created",
      performed_by: created_by,
      remarks: `HR submitted onboarding request for ${first_name} ${last_name}. Awaiting finance approval.`,
    });

    return res.status(201).json({
      success: true,
      message: "Employee onboarding request submitted successfully.",
      data: employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error as any,
    });
  }
};
