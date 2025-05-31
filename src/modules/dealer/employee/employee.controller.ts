import { Request, Response } from "express"
import {
  addDealerEmployeeService,
  deleteDealerEmployeeService,
  getDealerEmployeeByDealerIDService,
  updateDealerEmployeeService,
} from "./employee.service"

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

export const addDealerEmployeeHandler = async (req: Request, res: Response) => {
  const { name, email, role, contact_number } = req.body
  const dealerId = req.dealer?.id
  const dealer_id = req.dealer?.dealer_id

  if (!name || !email || !role || !contact_number) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "All fields are required",
    })
  }
  const result = await addDealerEmployeeService(
    dealerId!,
    dealer_id!,
    name,
    email,
    role,
    contact_number
  )
  if (!result) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Failed to add employee",
    })
  }
  return res.status(result.status).json({
    status: result.status,
    success: result.success,
    message: result.message,
    data: result.data,
  })
}

export const updateDealerEmployeeHandler = async (req: Request, res: Response) => {
  const { employee_id } = req.params
  const { name, email, role, contact_number } = req.body

  console.log("employee_id", employee_id)
  console.log("Body", req.body)

  const dealerId = req.dealer?.id
  console.log("dealerId", dealerId)
  if (!dealerId || !name || !email || !role || !contact_number || !employee_id) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "All fields are required",
    })
  }
  const result = await updateDealerEmployeeService(
    dealerId,
    employee_id,
    name,
    email,
    role,
    contact_number
  )
  return res.status(result.status).json({
    status: result.status,
    success: result.success,
    message: result.message,
    data: result.data,
  })
}

export const deleteDealerEmployeeHandler = async (req: Request, res: Response) => {
  const { employee_id } = req.params
  const dealerId = req.dealer?.id
  if (!dealerId || !employee_id) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "All fields are required",
    })
  }
  const result = await deleteDealerEmployeeService(dealerId, employee_id)
  return res.status(result.status).json({
    status: result.status,
    success: result.success,
    message: result.message,
    data: result.data,
  })
}
