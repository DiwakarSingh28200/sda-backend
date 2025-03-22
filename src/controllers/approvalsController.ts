import { Request, Response } from "express";
import { db } from "../config/db";
import { ApiResponse } from "../types/apiResponse";

// Finance or Business Head approves/rejects an employee
// export const updateApprovalStatus = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
//   try {
//     const { employee_id } = req.params;
//     const { status, remarks } = req.body;
//     const approver_id = req.user?.id;
//     const approver_role = req.user?.roles[0]; // Only first role is used

//     // Check if the employee exists
//     const { data: employee, error: employeeError } = await db
//       .from("employees")
//       .select("id, first_name, last_name, status")
//       .eq("id", employee_id)
//       .single();

//     if (employeeError || !employee) {
//       return res.status(404).json({ success: false, message: "Employee not found." });
//     }

//     // Determine approval stage
//     const approvalStage = approver_role === "finance_head" ? "finance" : "business";

//     // Update approval status
//     let newStatus = "";
//     if (status === "approved") {
//       newStatus = approvalStage === "finance" ? "finance_approved" : "approved";
//     } else if (status === "rejected") {
//       newStatus = "rejected";
//     } else {
//       return res.status(400).json({ success: false, message: "Invalid approval status." });
//     }

//     // Update employee status
//     const { error: updateError } = await db
//       .from("employees")
//       .update({ status: newStatus })
//       .eq("id", employee_id);

//     if (updateError) {
//       return res.status(500).json({ success: false, message: "Failed to update approval status.", error: updateError.message });
//     }

//     // Insert approval record
//     // await db.from("approvals").insert({
//     //     employee_id: employee_id,
//     //     approved_by: approver_id, // Ensured as a valid string
//     //     approver_role, // Ensured as a valid string
//     //     status,
//     //     approval_stage: approvalStage,
//     //     remarks: remarks || null, // Allow null if no remarks provided
//     //   });

//     await db.from("approvals").insert({
//         employee_id: employee_id!,
//         approved_by: approver_id || ""  ,
//         approver_role: approver_role || "",
//         status: status || "",
//         approval_stage: approvalStage || "",
//         remarks: remarks || null,
//     })
  

//     // Send Notification to Next Approver or HR if Rejected
//     if (status === "approved") {
//       if (approvalStage === "finance") {
//         // Notify Business Head
//         const businessHead = await db.from("employees").select("id").eq("role_id", "business_head").single();
//         if (businessHead.data) {
//           await db.from("notifications").insert([
//             {
//               recipient_id: businessHead.data.id,
//               message: `Finance has approved ${employee.first_name} ${employee.last_name}. Waiting for final approval.`,
//               type: "approval",
//             }
//           ]);
//         }
//       } else {
//         // Notify Employee & HR after final approval
//         const hr = await db.from("employees").select("id").eq("role_id", "hr_manager").single();
//         // await db.from("notifications").insert([
//         //   { recipient_id: hr?.data?.id, message: `Employee ${employee.first_name} ${employee.last_name} has been fully approved.`, type: "system" },
//         // ]);

//         await db.from("notifications").insert({
//             recipient_id: hr?.data?.id || "",
//             message: `Employee ${employee.first_name} ${employee.last_name} has been fully approved.`,
//             type: "system",
//           })    
//       }
//     } else {
//       // Notify HR if rejected
//       const hr = await db.from("employees").select("id").eq("role_id", "hr_manager").single();
//     await db.from("notifications").insert({
//         recipient_id: hr?.data?.id || "",
//         message: `Employee ${employee.first_name} ${employee.last_name} was rejected by ${approver_role}.`,
//         type: "alert",
//       })
// }
//     // Log Action in `audit_logs`
//     await db.from("audit_logs").insert({
//         employee_id: employee_id || "",
//         action: status === "approved" ? "approval" : "rejection",
//         performed_by: approver_id || "",
//         remarks: `${approver_role} ${status}d ${employee.first_name} ${employee.last_name}. ${remarks ? "Reason: " + remarks : ""}`
//       })

//     return res.status(200).json({ success: true, message: `Employee ${status} successfully.`, data: { employee_id, newStatus } });

//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
//   }
// };

export const updateApprovalStatus = async (req: Request, res: Response<ApiResponse<any>>): Promise<any> =>{
  try {
    const { approval_id } = req.params;
    const { status, remarks } = req.body;
    const approver_id = req.user?.id;
    const approver_role = req.user?.roles[0];
    return res.status(200).json({ success: true, message: `Employee ${status} successfully.`, data: [] });
  }catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
}

export const createApproval = async (req: Request, res: Response<ApiResponse<any>>): Promise<any> => {
  try {
  }catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
}
export const getApprovals = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const userId = req.user?.id;
    console.log("userId", userId);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { data, error } = await db
      .from("approvals")
      .select(`
        type:request_type_id(name),
        reference_id,
        requested_by:requested_by(id, first_name, last_name),
        assigned_to:assigned_to(id, first_name, last_name),
        approval_status,
        approval_comment,
        created_at
      `)
      .or(`requested_by.eq.${userId},assigned_to.eq.${userId}`);

    if (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch approvals", error: error.message });
    }

    return res.status(200).json({ success: true, message: "Approvals fetched successfully", data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
