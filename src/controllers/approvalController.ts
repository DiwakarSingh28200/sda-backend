import { Request, Response } from "express"
import { db } from "../config/db"
import { ApiResponse } from "../types/apiResponse"
import { createApprovalInstance } from "../services/approvalService" // ✅ from earlier
import { createNotification } from "../services/notificationService" // ⬅️ optional helper if needed
import { Database } from "../types/supabase"
import { getBusinessHeadId } from "../services/employeeService"

type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"]
type ApprovalUpdate = Database["public"]["Tables"]["approvals"]["Update"]
// ────────────────────────────────────────────────────────
// ✅ GET: Fetch All Approvals (requested_by or assigned_to)
// ────────────────────────────────────────────────────────

export const getApprovals = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })

    const { data, error } = await db
      .from("approvals")
      .select(
        `
        id,
        step_number,
        reference_id,
        approval_status,
        approval_comment,
        created_at,
        metadata,
        type:request_type_id(name),
        requested_by:requested_by(id, first_name, last_name),
        assigned_to:assigned_to(id, first_name, last_name)
      `
      )
      .or(`requested_by.eq.${userId},assigned_to.eq.${userId}`)
      .order("created_at", { ascending: false })

    if (error) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch approvals", error: error.message })
    }

    return res.status(200).json({ success: true, message: "Approvals fetched successfully", data })
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error.message })
  }
}

export const updateApprovalStatus = async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const { approval_id } = req.params
    const { status, remarks } = req.body
    const currentUser = req.user!

    // 1. Fetch current approval
    const { data: approval, error: approvalError } = await db
      .from("approvals")
      .select(
        `
        *,
        type:request_type_id(name)
      `
      )
      .eq("id", approval_id)
      .single()

    if (approvalError || !approval) {
      return res.status(404).json({ success: false, message: "Approval not found" })
    }

    // 2. Update current step
    const { error: updateError } = await db
      .from("approvals")
      .update({
        approval_status: status,
        approval_comment: remarks,
        updated_at: new Date().toISOString(),
      })
      .eq("id", approval_id)

    if (updateError) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update approval", error: updateError.message })
    }

    // 3. If approved AND NOT final step → create next step
    if (status === "approved" && approval.step_number === 1) {
      const nextAssignee = await getBusinessHeadId() // or logic based on roles

      const safeMetadata =
        approval.metadata && typeof approval.metadata === "object" ? approval.metadata : {}

      // const nextApproval = await createApprovalInstance({
      //   typeName: approval.type.name,
      //   referenceId: approval.reference_id,
      //   requestedBy: approval.requested_by,
      //   assignedTo: nextAssignee,
      //   step: 2,
      //   metadata: {
      //     ...safeMetadata,
      //     prev_approved_by: currentUser.id,
      //   },
      // })

      // // 4. Send notification to next step approver
      // await db.from("notifications").insert({
      //   recipient_id: nextAssignee,
      //   sender_id: currentUser.id,
      //   type: "approval",
      //   message: `New approval request: ${approval.type.name.replace(/_/g, " ")}`,
      //   reference_id: nextApproval.id,
      //   metadata: {
      //     focus: nextApproval.id,
      //     type: approval.type.name,
      //     step: 2,
      //     entity_id: nextApproval.reference_id,
      //   },
      // })
    }

    return res.status(200).json({ success: true, message: `Approval ${status} successfully.` })
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error.message })
  }
}

// export const getApprovalTimeline = async (req: Request, res: Response<ApiResponse<any>>) => {
//   const { reference_id } = req.params

//   const { data, error } = await db
//     .from("approvals")
//     .select(
//       `
//       id,
//       approval_status,
//       approval_comment,
//       step_number,
//       created_at,
//       assigned_to:assigned_to(id, first_name, last_name)
//     `
//     )
//     .eq("reference_id", reference_id)
//     .order("step_number", { ascending: true })

//   if (error) {
//     return res
//       .status(500)
//       .json({ success: false, message: "Failed to fetch timeline", error: error.message })
//   }

//   return res.json({ success: true, message: "Timeline fetched", data })
// }

// Get Business Head from DB
const getBusinessHead = async () => {
  const { data: role } = await db.from("roles").select("id").eq("role", "business_head").single()

  if (!role) return null

  const { data: empRole } = await db
    .from("employee_roles")
    .select("employee_id")
    .eq("role_id", role.id)
    .limit(1)
    .single()

  if (!empRole) return null

  const { data: emp } = await db
    .from("employees")
    .select("id, first_name, last_name")
    .eq("id", empRole.employee_id!)
    .single()

  return emp
}

export const getApprovalTimeline = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { reference_id } = req.params

    // Step 0: Get the initial approval record to fetch request initiator
    const { data: initiatorApproval } = await db
      .from("approvals")
      .select("requested_by:requested_by(id, first_name, last_name), created_at")
      .eq("reference_id", reference_id)
      .order("created_at", { ascending: true })
      .limit(1)
      .single()

    if (!initiatorApproval) {
      return res.status(404).json({ success: false, message: "Approval not found" })
    }

    const timeline = []

    // Push Step 0
    timeline.push({
      step_number: 0,
      label: "Initiated by HR",
      status: "submitted",
      performed_by: initiatorApproval.requested_by,
      created_at: initiatorApproval.created_at,
      approval_comment: "Onboarding initiated.",
    })

    // Step 1 & 2 Approvals
    const { data: approvals } = await db
      .from("approvals")
      .select(
        "step_number, approval_status, approval_comment, created_at, assigned_to(id, first_name, last_name)"
      )
      .eq("reference_id", reference_id)
      .order("step_number", { ascending: true })

    if (approvals) {
      approvals.forEach((approval) => {
        timeline.push({
          step_number: approval.step_number,
          label: approval.step_number === 1 ? "Finance Approval" : "Business Head Approval",
          status: approval.approval_status,
          performed_by: approval.assigned_to,
          created_at: approval.created_at,
          approval_comment: approval.approval_comment,
        })
      })
    }

    // If business head approval (step 2) is not created yet, append a placeholder
    const hasStep2 = approvals?.some((a) => a.step_number === 2)
    if (!hasStep2) {
      const businessHead = await getBusinessHead()

      if (businessHead) {
        timeline.push({
          step_number: 2,
          label: "Business Head Approval",
          status: "upcoming",
          performed_by: businessHead,
          created_at: null,
          approval_comment: null,
        })
      }
    }

    return res.json({
      success: true,
      message: "Approval timeline fetched successfully.",
      data: timeline,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error as string,
    })
  }
}
