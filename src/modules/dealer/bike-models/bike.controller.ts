import { Request, Response } from "express"
import { getBikeModelsByCompanyName } from "./bike.service"

export const getBikeModelsByCompanyNameController = async (req: Request, res: Response) => {
  const { brand } = req.query
  const bikeModels = await getBikeModelsByCompanyName(brand as string)
  return res.status(200).json({
    success: true,
    data: bikeModels,
    message: "Bike models fetched successfully",
  })
}
