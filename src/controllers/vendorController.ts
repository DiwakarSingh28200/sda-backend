import { Request, Response } from "express"
import { CreateVendorSchema } from "../types/schemas/vendorSchema"
import { createVendor, getAllVendors, getVendorById } from "../services/vendorService"

const humanizeKey = (path: string[]) => {
  const field = path[path.length - 1]
  return field
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (l) => l.toUpperCase()) // capitalize
}

export const handleCreateVendor = async (req: Request, res: Response) => {
  const parsed = CreateVendorSchema.safeParse(req.body)
  if (!parsed.success) {
    const messages: string[] = []
    for (const issue of parsed.error.issues) {
      const label = humanizeKey(issue.path as string[])
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
  const result = await getAllVendors()
  res.status(200).json({ success: true, data: result })
}
