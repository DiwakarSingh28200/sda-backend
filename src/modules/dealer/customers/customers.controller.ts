import { Request, Response } from "express"
import { createCustomerService } from "./customers.service"
import { CustomerOnboardSchema } from "./customers.schema"

export const createCustomerHandler = async (req: Request, res: Response) => {
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

  const dealerEmployeeId = req.dealer?.id || ""

  const result = await createCustomerService(payload, dealerEmployeeId)
  return res.status(result.status).json(result)
}
