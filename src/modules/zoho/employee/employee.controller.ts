import { Request, Response } from "express"
import { EmployeeOnboardingSchema } from "./employee.schema"
import { onboardEmployeeService } from "./employee.service"
import { zodErrorFormatter } from "../../../utils/index"
import { asyncHandler } from "../../../utils/asyncHandler"

export const onboardEmployeeController = asyncHandler(async (req: Request, res: Response) => {
  const parsed = EmployeeOnboardingSchema.safeParse(req.body)

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

  const result = await onboardEmployeeService(parsed.data)

  return res.status(result.success ? 200 : 400).json({
    success: result.success,
    message: result.message,
    data: result.data,
  })
})
