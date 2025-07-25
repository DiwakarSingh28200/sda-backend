import { Request, Response } from "express"
import {
  getDealerMetricsService,
  getSalesChartService,
  getTopEmployeesService,
  getPlanTypeStatsService,
  getEmployeeSalesStats,
  getEmployeeSalesChartService,
} from "./dashboard.service"
import moment from "moment"

export const getDealerMetricsHandler = async (req: Request, res: Response) => {
  const { dealer_id } = req.query as { dealer_id?: string }

  if (!dealer_id) {
    return res.status(400).json({
      success: false,
      message: "dealer_id is required",
    })
  }
  const data = await getDealerMetricsService(dealer_id)
  return res.status(200).json({
    success: true,
    message: "Dashboard metrics fetched successfully",
    data,
  })
}

export const getSalesChartHandler = async (req: Request, res: Response) => {
  const {
    dealer_id,
    range = "monthly",
    month,
    year,
  } = req.query as {
    dealer_id?: string
    range?: "7d" | "monthly" | "quarterly" | "yearly"
    month?: string
    year?: string
  }

  if (!dealer_id) {
    return res.status(400).json({
      success: false,
      message: "dealer_id is required",
    })
  }

  try {
    const data = await getSalesChartService({
      dealer_id,
      range,
      month: month ? parseInt(month) : undefined,
      year: year ? parseInt(year) : undefined,
    })

    return res.status(200).json({
      success: true,
      message: "Sales chart fetched successfully",
      data,
    })
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch sales chart",
    })
  }
}

export const getTopEmployeesHandler = async (req: Request, res: Response) => {
  const { dealer_id } = req.query as { dealer_id?: string }

  if (!dealer_id) {
    return res.status(400).json({
      success: false,
      message: "dealer_id is required",
    })
  }

  const data = await getTopEmployeesService(dealer_id!)
  return res.status(200).json({
    success: true,
    message: "Top performing employees fetched successfully",
    data,
  })
}

export const getPlanTypeStatsHandler = async (req: Request, res: Response) => {
  const { dealer_id } = req.query as { dealer_id?: string }

  if (!dealer_id) {
    return res.status(400).json({
      success: false,
      message: "dealer_id is required",
    })
  }
  const data = await getPlanTypeStatsService(dealer_id)
  return res.status(200).json({
    success: true,
    message: "Plan type stats fetched successfully",
    data,
  })
}

export const getEmployeeSalesStatsHandler = async (req: Request, res: Response) => {
  const { dealer_id, employee_id } = req.query as { dealer_id: string; employee_id: string }

  if (!dealer_id || !employee_id) {
    return res.status(400).json({
      success: false,
      message: "dealer_id and employee_id are required",
    })
  }

  const data = await getEmployeeSalesStats(dealer_id, employee_id)
  return res.status(200).json({
    success: true,
    message: "Employee sales stats fetched successfully",
    data,
  })
}

export const getEmployeeSalesChartHandler = async (req: Request, res: Response) => {
  const {
    employee_id,
    range = "monthly",
    month,
    year,
  } = req.query as {
    employee_id?: string
    range?: "7d" | "monthly" | "quarterly" | "yearly"
    month?: string
    year?: string
  }

  if (!employee_id) {
    return res.status(400).json({
      success: false,
      message: "employee_id is required",
    })
  }

  try {
    const data = await getEmployeeSalesChartService({
      employee_id,
      range,
      month: month ? parseInt(month) : undefined,
      year: year ? parseInt(year) : undefined,
    })

    return res.status(200).json({
      success: true,
      message: "Employee sales chart fetched successfully",
      data,
    })
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch employee sales chart",
    })
  }
}
