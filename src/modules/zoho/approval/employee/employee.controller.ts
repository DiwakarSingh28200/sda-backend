import { Request, Response } from "express"
import { asyncHandler } from "../../../../utils/asyncHandler"
import { db } from "../../../../config/db"

export const approveEmployeeController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  // find the employee by id and update status approve
  const { data: employee, error } = await db
    .from("employees")
    .update({ status: "approved" })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }

  return res.status(200).json({
    success: true,
    message: "Employee approved successfully",
    data: employee,
  })
})

export const rejectEmployeeController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  // find the employee by id and update status reject
  const { data: employee, error } = await db
    .from("employees")
    .update({ status: "rejected" })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }

  return res.status(200).json({
    success: true,
    message: "Employee rejected successfully",
    data: employee,
  })
})
