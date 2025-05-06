import { Request, Response } from "express"
import { db } from "../config/db"
import { ApiResponse } from "../types/apiResponse"
// adjust this path as needed

export const getAllPlans = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { data: plans, error } = await db.from("rsa_plans" as any).select(`
        id,
        name,
        description,
        price,
        validity,
        rsa_plan_features (
          rsa_features (id,name,description)
        )
      `)

    if (error || !plans) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch plans with features.",
        error: error?.message,
      })
    }

    return res.json({
      success: true,
      message: "Plans with features retrieved successfully.",
      data: plans,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: (error as Error).message,
    })
  }
}
