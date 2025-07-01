import { Request, Response } from "express"
import {
  onboardDealerService,
  getAllDealersService,
  employeeDealerCountStat,
} from "./dealer.service"
import { DealerOnboardingSchema } from "./dealer.schema"
import { zodErrorFormatter } from "../../../utils/index"
import { db } from "../../../config/db"

export const onboardDealerHandler = async (req: Request, res: Response) => {
  const parsed = DealerOnboardingSchema.safeParse(req.body)

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
  const createdBy = (req as any).user?.id

  const result = await onboardDealerService(parsed.data, createdBy)
  return res.status(result.status).json(result)
}

export const getAllDealersHandler = async (req: Request, res: Response) => {
  const employeeID = (req as any).user?.id
  if (!employeeID) {
    return res.status(400).json({ success: false, message: "Employee ID is required" })
  }
  const result = await getAllDealersService(employeeID)
  return res.status(result.status).json(result)
}

export const getSubDealerLeads = async (req: Request, res: Response) => {
  try {
    const { data, error } = await db
      .from("dealer_sub_dealerships")
      .select(
        "id, name, contact, oem, address, master_dealer:dealer_id(id, dealer_id,dealership_name), status"
      )

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch sub dealers",
        error: error,
      })
    }

    return res.status(200).json({
      success: true,
      message: "Sub dealers fetched successfully",
      data,
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    })
  }
}

export const getDealerByDealerID = async (req: Request, res: Response) => {
  try {
    const { dealer_id } = req.params

    // only get dealer detailes if the dealer is master dealer
    const { data, error } = await db
      .from("dealers")
      .select(
        // "id, dealer_id,dealership_name,dealership_type,city,state,owner_name,operations_contact_phone,email,created_at"
        "*"
      )
      .eq("dealer_id", dealer_id)
      .eq("is_master_dealer", true)
      .single()

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch dealer",
        error: error.message,
      })
    }

    // also share the sub dealerships with the dealer
    const { data: subDealerships, error: subDealershipsError } = await db
      .from("dealer_sub_dealerships")
      .select("id, name, contact, oem, address")
      .eq("dealer_id", data.id)

    return res.status(200).json({
      success: true,
      message: "Dealer fetched successfully",
      data: {
        ...data,
        sub_dealerships: subDealerships,
      },
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getDealerProfileById = async (req: Request, res: Response) => {
  const { dealer_id } = req.params
  try {
    const { data: dealerData, error } = await db
      .from("dealers")
      .select(
        `
        *,
        documents:dealer_documents(*),
        employees:dealer_employees(name, role, contact_number, email),
        finance_info:dealer_finance_info(*),
        services:dealer_services(*),
        sub_dealerships:dealer_sub_dealerships(*)
      `
      )
      .eq("dealer_id", dealer_id)
      .single()

    if (!dealerData && error) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      })
    }

    // Restructure the response
    const response = {
      dealer: {
        id: dealerData.id,
        dealership_type: dealerData.dealership_type,
        dealership_name: dealerData.dealership_name,
        registered_address: dealerData.registered_address,
        city: dealerData.city,
        state: dealerData.state,
        pincode: dealerData.pincode,
        gps_location: dealerData.gps_location,
        operations_contact_name: dealerData.operations_contact_name,
        operations_contact_phone: dealerData.operations_contact_phone,
        email: dealerData.email,
        owner_name: dealerData.owner_name,
        owner_contact: dealerData.owner_contact,
        owner_email: dealerData.owner_email,
        escalation_name: dealerData.escalation_name,
        escalation_contact: dealerData.escalation_contact,
        escalation_email: dealerData.escalation_email,
        pan_number: dealerData.pan_number,
        gst_number: dealerData.gst_number,
        dealer_id: dealerData.dealer_id,
        login_enabled: dealerData.login_enabled,
        created_by: dealerData.created_by,
        created_at: dealerData.created_at,
        parent_dealer_id: dealerData.parent_dealer_id,
        is_sub_dealer: dealerData.is_sub_dealer,
        is_master_dealer: dealerData.is_master_dealer,
        is_email_verified: dealerData.is_email_verified,
        is_contact_verified: dealerData.is_contact_verified,
        vehicle_types: dealerData.vehicle_types,
        oems: [dealerData.oem],
        status: dealerData.status,
        manager_name: dealerData.manager_name,
        manager_contact: dealerData.manager_contact,
        msme_number: dealerData.msme_number,
      },
      documents: dealerData?.documents[0],
      finance_info: dealerData.finance_info[0],
      employees: dealerData.employees,
      sub_dealerships: dealerData.sub_dealerships,
      services: dealerData.services,
      oems: [dealerData.oem],
    }

    return res.status(200).json({
      success: true,
      message: "Dealer found",
      data: response,
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getDealerOnboardStatController = async (req: Request, res: Response) => {
  const employeeID = req.user?.id
  if (!employeeID) {
    return res.status(400).json({ success: false, message: "Employee ID is required" })
  }
  const result = await employeeDealerCountStat(employeeID)
  res.status(200).json({ success: true, data: result })
}
