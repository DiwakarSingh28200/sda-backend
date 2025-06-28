import { Request, Response } from "express"
import { getLastFiveWithdrawalsAndAdds } from "./transaction.service"
import { asyncHandler } from "../../../../utils/asyncHandler"

export const getLastFiveWithdrawalsAndAddsController = asyncHandler(
  async (req: Request, res: Response) => {
    const dealerId = req.dealer?.id

    if (!dealerId) {
      return res.status(400).json({ message: "dealer_id is required" })
    }

    const { success, message, data } = await getLastFiveWithdrawalsAndAdds(dealerId)

    if (!success) {
      return res.status(400).json({ message })
    }

    return res.status(200).json({ message, data })
  }
)
