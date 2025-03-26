import { Request, Response } from "express"
import { ApiResponse } from "../types/apiResponse"
import { approveStep, rejectStep, resubmitStep } from "../services/approvalService"

export const handleApprovalAction = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { id } = req.params
    const { action, comment } = req.body
    const userId = req.user?.id

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be 'approve' or 'reject'.",
      })
    }

    const result =
      action === "approve"
        ? await approveStep({ instance_id: id, performed_by: userId!, comment })
        : await rejectStep({ instance_id: id, performed_by: userId!, comment })

    return res.status(200).json({
      success: true,
      message: result.message,
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to process approval action.",
      error: error.message,
    })
  }
}

export const resubmitApprovalStep = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { id } = req.params // approval_instance_id
    const { correction_comment } = req.body
    const userId = req.user?.id

    const result = await resubmitStep({
      instance_id: id,
      performed_by: userId!,
      correction_comment,
    })

    return res.status(200).json({
      success: true,
      message: result.message,
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to resubmit approval request.",
      error: error.message,
    })
  }
}
