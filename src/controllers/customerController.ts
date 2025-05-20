import { Request, Response } from "express"
import { createCustomer } from "../services/customerService"
import { CustomerOnboardSchema } from "../types/schemas/customerOnboardSchema"
import { successResponse, errorResponse } from "../utils/apiResponse"

export const createCustomerHandler = async (req: Request, res: Response) => {
  console.log("Body", req.body)
  const parsed = CustomerOnboardSchema.safeParse(req.body)

  if (!parsed.success) {
    return res
      .status(400)
      .json(
        errorResponse(
          "Validation failed",
          parsed.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
        )
      )
  }

  try {
    const result = await createCustomer(parsed.data)
    console.log("result: ", result)
    return res.status(201).json(successResponse("Customer onboarded successfully", result))
  } catch (err: any) {
    return res.status(500).json(errorResponse("Something went wrong", err.message))
  }
}
