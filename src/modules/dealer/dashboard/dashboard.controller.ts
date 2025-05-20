import { Request, Response } from "express"
import {
  getDealerMetricsService,
  getSalesChartService,
  getTopEmployeesService,
  getPlanTypeStatsService,
} from "./dashboard.service"

export const getDealerMetricsHandler = async (req: Request, res: Response) => {
  const dealer_id = req.dealer?.id!
  const data = await getDealerMetricsService(dealer_id)
  return res.status(200).json({
    success: true,
    message: "Dashboard metrics fetched successfully",
    data,
  })
}

export const getSalesChartHandler = async (req: Request, res: Response) => {
  const dealer_id = req.dealer?.id!
  const data = await getSalesChartService(dealer_id)
  return res.status(200).json({
    success: true,
    message: "Sales chart fetched successfully",
    data,
  })
}

export const getTopEmployeesHandler = async (req: Request, res: Response) => {
  const dealer_id = req.dealer?.id!
  const data = await getTopEmployeesService(dealer_id)
  return res.status(200).json({
    success: true,
    message: "Top performing employees fetched successfully",
    data,
  })
}

export const getPlanTypeStatsHandler = async (req: Request, res: Response) => {
  const dealer_id = req.dealer?.id!
  const data = await getPlanTypeStatsService(dealer_id)
  return res.status(200).json({
    success: true,
    message: "Plan type stats fetched successfully",
    data,
  })
}
