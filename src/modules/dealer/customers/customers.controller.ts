import { Request, Response } from "express"
import { createCustomerService } from "./customers.service"
import { CustomerOnboardSchema } from "./customers.schema"

export const createCustomerHandler = async (req: Request, res: Response) => {
  try {
    console.log("req.body", req.body)
    const parsed = CustomerOnboardSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: parsed.error.flatten().fieldErrors,
      })
    }

    const payload = {
      ...parsed.data,
    }

    const dealerEmployeeId = req.dealerEmployee?.id!

    const result = await createCustomerService(payload, dealerEmployeeId)
    return res.status(result.status).json(result)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}
