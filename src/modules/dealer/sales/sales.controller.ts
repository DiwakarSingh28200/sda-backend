import { Request, Response } from "express"
import { getDealerSales, getDelaerSalesAndComissions, getRsaplans } from "./sales.service"

export const getDealerSalesHandler = async (req: Request, res: Response) => {
  const dealer_id = req.query.dealer_id as string
  const employee_id = req.query.employee_id as string

  if (!dealer_id) {
    return res.status(400).json({
      success: false,
      message: "Missing dealer_id",
    })
  }

  const data = await getDealerSales(dealer_id.toString(), employee_id?.toString())

  return res.status(200).json({
    success: true,
    message: "Sales fetched successfully",
    data,
  })
}

export const getDelaerSalesAndComissionsHandler = async (req: Request, res: Response) => {
  const dealer_id = req.query.dealer_id as string

  const data = await getDelaerSalesAndComissions(dealer_id.toString())

  return res.status(200).json(data)
}

export const getRsaplansHandler = async (req: Request, res: Response) => {
  const data = await getRsaplans()
  return res.status(200).json(data)
}
