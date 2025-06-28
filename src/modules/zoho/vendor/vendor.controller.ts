import { Request, Response } from "express"
import {
  approveVendorService,
  getAllPendingVendorsService,
  rejectVendorService,
} from "./vendor.services"

export const getAllPendingVendorsController = async (req: Request, res: Response) => {
  const result = await getAllPendingVendorsService()
  res.status(200).json(result)
}

export const approveVendorController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await approveVendorService(id)
  res.status(200).json(result)
}

export const rejectVendorController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await rejectVendorService(id)
  res.status(200).json(result)
}
