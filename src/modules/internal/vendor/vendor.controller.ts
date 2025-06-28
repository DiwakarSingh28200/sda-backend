import { Request, Response } from "express"
import { CreateVendorSchema } from "./vendor.schema"
import {
  createVendor,
  getVendorById,
  getAllVendors,
  employeeVendorCountStat,
} from "./vendor.service"
import { zodErrorFormatter } from "../../../utils"

export const handleCreateVendor = async (req: Request, res: Response) => {
  const parsed = CreateVendorSchema.safeParse(req.body)
  if (!parsed.success) {
    const messages: string[] = []
    for (const issue of parsed.error.issues) {
      const label = zodErrorFormatter(issue.path as string[])
      messages.push(`${label}: ${issue.message}`)
    }

    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    })
  }

  try {
    const createdBy = (req as any).user?.id
    const result = await createVendor(parsed.data, createdBy)
    res.status(201).json({ success: true, message: "Vendor created successfully", data: result })
  } catch (err: any) {
    console.error(err)
    res
      .status(500)
      .json({ success: false, message: "Failed to create vendor", error: err.message })
  }
}

export const handleGetVendorById = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await getVendorById(id)
  res.status(200).json({ success: true, data: result })
}

export const handleGetAllVendors = async (req: Request, res: Response) => {
  const employeeID = (req as any).user?.id
  if (!employeeID) {
    return res.status(400).json({ success: false, message: "Employee ID is required" })
  }
  const result = await getAllVendors(employeeID)
  res.status(200).json({ success: true, data: result })
}

export const getEmployeeVendorStatusController = async (req: Request, res: Response) => {
  const employeeID = (req as any).user?.id
  if (!employeeID) {
    return res.status(400).json({ success: false, message: "Employee ID is required" })
  }
  const result = await employeeVendorCountStat(employeeID)
  res.status(200).json({ success: true, data: result })
}
