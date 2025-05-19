import { Request, Response } from "express"
import { getDealerProfileService } from "./profile.service"

export const getDealerProfileHandler = async (req: Request, res: Response) => {
  const dealer_id = req.dealer?.dealer_id
  if (!dealer_id) {
    return res.status(401).json({ success: false, message: "Unauthorized" })
  }

  const data = await getDealerProfileService(dealer_id)
  return res.status(200).json({
    success: true,
    message: "Dealer profile fetched successfully",
    data,
  })
}

export const updateDealerProfileHandler = async (req: Request, res: Response) => {
  const dealer_id = req.dealer?.dealer_id
  if (!dealer_id) {
    return res.status(401).json({ success: false, message: "Unauthorized" })
  }
}
