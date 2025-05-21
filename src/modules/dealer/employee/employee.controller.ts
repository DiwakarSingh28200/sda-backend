import { Request, Response } from "express"
import { getDealerEmployeeByDealerIDService } from "./employee.service"

export const getDealerEmployeeByDealerIDHandler = async (req: Request, res: Response) => {
  const { dealer_id } = req.params
  const result = await getDealerEmployeeByDealerIDService(dealer_id)
  return res.status(200).json({
    status: 200,
    success: true,
    message: "Dealer employee fetched successfully",
    data: result,
  })
}
