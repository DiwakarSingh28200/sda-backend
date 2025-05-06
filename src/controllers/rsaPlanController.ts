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
        features:rsa_plan_features (
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
    const formattedPlans = plans.map((plan: any) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      validity: plan.validity,
      features: plan.features.map((f: any) => f.rsa_features),
    }))

    return res.json({
      success: true,
      message: "Plans with features retrieved successfully.",
      data: formattedPlans,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: (error as Error).message,
    })
  }
}
