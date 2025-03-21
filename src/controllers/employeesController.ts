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

// export const createEmployee = async (req:  Request<any, any, CreateEmployeeRequest>, res: Response<ApiResponse<any>>): Promise<Response> => {
//   try {
//     const {
//       personal_info,
//       documents,
//       bank_details,
//       emergency_contact,
//       employment_details,
//       created_by
//     } = req.body;

//     // ✅ Step 1: Validate Required Fields
//     if (!personal_info || !employment_details || !created_by) {
//       return res.status(400).json({ success: false, message: "Missing required fields." });
//     }

//     // ✅ Step 2: Hash Employee Password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash("Default@123", salt); // Default password (later changeable)

//     // ✅ Step 3: Insert Employee into DB
//     const { data: employee, error } = await db
//       .from("employees")
//       .insert({
//         first_name: personal_info.first_name,
//         last_name: personal_info.last_name,
//         dob: personal_info.dob,
//         gender: personal_info.gender,
//         email: personal_info.email,
//         phone: personal_info.phone,
//         address: personal_info.address,

//         // ✅ Documents
//         aadhar_id: documents?.aadhar_id,
//         pancard: documents?.pancard,

//         // ✅ Bank Details
//         bank_account: bank_details?.bank_account,
//         ifsc_code: bank_details?.ifsc_code,

//         // ✅ Emergency Contact
//         emergency_contact: `${emergency_contact?.name} - ${emergency_contact?.phone} (${emergency_contact?.relation})`,

//         // ✅ Employment Details
//         role_id: employment_details.role_id,
//         department_id: employment_details.department_id,
//         employment_type: employment_details.employment_type,
//         salary: employment_details.salary,
//         tax_deductions: employment_details.tax_deductions ?? 0.0,
//         provident_fund: employment_details.provident_fund ?? 0.0,
//         reporting_manager: employment_details.reporting_manager,

//         // ✅ Other Fields
//         status: "pending", // Employee starts in pending state
//         created_by,
//         password: hashedPassword,
//       })
//       .select("id, first_name, last_name, email, department_id")
//       .single();

//     if (error) {
//       return res.status(500).json({ success: false, message: "Failed to create employee.", error: error.message });
//     }

//     // ✅ Step 4: Insert Approval for Finance Head
//     await db.from("approvals").insert({
//       employee_id: employee.id,
//       approved_by: null, // Finance Head to be assigned dynamically
//       approver_role: "finance_head",
//       status: "pending",
//       approval_stage: "Finance Approval",
//       remarks: null,
//     });

//     // ✅ Step 5: Log in Audit Table
//     await db.from("audit_logs").insert({
//       employee_id: employee.id,
//       action: "Created Employee",
//       performed_by: created_by,
//       remarks: `New employee ${employee.first_name} ${employee.last_name} was created.`,
//     });

//     return res.status(201).json({ success: true, message: "Employee created successfully.", data: employee });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
//   }
// };
