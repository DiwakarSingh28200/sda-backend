import { Request, Response } from "express"
import { db } from "../config/db"
import { ApiResponse } from "../types/apiResponse"

export const updateApprovalStatus = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<any> => {
  try {
    const { approval_id } = req.params
    const { status, remarks } = req.body
    const approver_id = req.user?.id
    const approver_role = req.user?.roles[0]
    return res
      .status(200)
      .json({ success: true, message: `Employee ${status} successfully.`, data: [] })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error: error as string })
  }
}

export const createApproval = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<any> => {
  try {
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error: error as string })
  }
}
export const getApprovals = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const userId = req.user?.id
    console.log("userId", userId)

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    const { data, error } = await db
      .from("approvals")
      .select(
        `
        type:request_type_id(name),
        reference_id,
        requested_by:requested_by(id, first_name, last_name),
        assigned_to:assigned_to(id, first_name, last_name),
        approval_status,
        approval_comment,
        created_at
      `
      )
      .or(`requested_by.eq.${userId},assigned_to.eq.${userId}`)

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
