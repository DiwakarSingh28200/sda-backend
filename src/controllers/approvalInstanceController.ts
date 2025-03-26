import { Request, Response } from "express"
import { ApiResponse } from "../types/apiResponse"
import { db } from "../config/db"
import { Database } from "../types/supabase"

export const getApprovalInstances = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    // ─── 1. Approvals where user is the requester ─────────────────────────
    const { data: requestedApprovals, error: error1 } = await db
      .from("approval_instances")
      .select(
        `
        *,
        approval_type:approval_type_id (id, name),
        requested_by (id, first_name, last_name),
        steps:approval_steps (
          id,
          step_number,
          role,
          status,
          comment,
          performed_at,
          performed_by,
          assigned_to (
            id,
            first_name,
            last_name
          )
        )
      `
      )
      .eq("requested_by", userId)

    if (error1) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch requested approvals",
        error: error1.message,
      })
    }

    // ─── 2. Approvals where user is assigned to any step ─────────────────
    const { data: assignedSteps, error: error2 } = await db
      .from("approval_steps")
      .select("instance_id")
      .eq("assigned_to", userId)

    if (error2) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch assigned approvals",
        error: error2.message,
      })
    }

    const instanceIds = assignedSteps?.map((step) => step.instance_id) || []

    const { data: assignedApprovals, error: error3 } = await db
      .from("approval_instances")
      .select(
        `
        *,
        approval_type:approval_type_id (id, name),
        requested_by (id, first_name, last_name),
        steps:approval_steps (
          id,
          step_number,
          role,
          status,
          comment,
          performed_at,
          performed_by,
          assigned_to (
            id,
            first_name,
            last_name
          )
        )
      `
      )
      .in(
        "id",
        instanceIds.filter((id): id is string => id !== null)
      )

    if (error3) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch assigned approvals",
        error: error3.message,
      })
    }

    // ─── 3. Merge + Deduplicate ──────────────────────────────────────────
    const allApprovalsMap = new Map()

    ;[...(requestedApprovals || []), ...(assignedApprovals || [])].forEach((approval) => {
      allApprovalsMap.set(approval.id, approval)
    })

    const allApprovals = Array.from(allApprovalsMap.values())

    return res.status(200).json({
      success: true,
      message: "Approvals fetched successfully",
      data: allApprovals,
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getApprovalTimeline = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const instanceId = req.params.id

    // Step 1: Fetch all approval steps for the instance
    const { data: steps, error: stepsError } = await db
      .from("approval_steps")
      .select(
        `
          id,
          step_number,
          role,
          assigned_to:assigned_to(id, first_name, last_name),
          status,
          comment,
          performed_by,
          performed_at
        `
      )
      .eq("instance_id", instanceId)
      .order("step_number", { ascending: true })

    if (stepsError) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch approval steps",
        error: stepsError.message,
      })
    }

    // Optional: Add initiator step (step_number = 0)
    const { data: initiator } = await db
      .from("approval_instances")
      .select(
        `
        created_at,
        requested_by(id, first_name, last_name)
      `
      )
      .eq("id", instanceId)
      .single()

    const fullTimeline = [
      {
        id: "initiator",
        step_number: 0,
        role: "Initiator",
        assigned_to: initiator?.requested_by,
        status: "submitted",
        comment: "Request initiated.",
        performed_by: initiator?.requested_by?.id,
        performed_at: initiator?.created_at,
      },
      ...(steps || []),
    ]

    return res.status(200).json({
      success: true,
      message: "Timeline fetched successfully",
      data: fullTimeline,
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    })
  }
}

export const getSingleApprovalInstance = async (req: Request, res: Response<ApiResponse<any>>) => {
  const { id } = req.params

  const { data, error } = await db
    .from("approval_instances")
    .select(
      `
        *,
        steps:approval_steps(*),
        requested_by:requested_by(id, first_name, last_name)
      `
    )
    .eq("id", id)
    .order("created_at", { ascending: true })
    .single()

  if (error || !data) {
    return res.status(404).json({
      success: false,
      message: "Approval instance not found",
      error: error?.message,
    })
  }

  return res.status(200).json({
    success: true,
    message: "Approval instance fetched successfully",
    data,
  })
}
