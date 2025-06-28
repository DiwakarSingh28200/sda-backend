import { Request, Response } from "express"
import {
  approveDealerService,
  getAllPendingDealersService,
  rejectDealerService,
} from "./dealer.services"

export const getAllPendingDealersController = async (req: Request, res: Response) => {
  const result = await getAllPendingDealersService()
  res.status(200).json(result)
}

export const approveDealerController = async (req: Request, res: Response) => {
  const { id } = req.params
  console.log("dealerId", id)
  const result = await approveDealerService(id)
  res.status(200).json(result)
}

export const rejectDealerController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await rejectDealerService(id)
  res.status(200).json(result)
}
