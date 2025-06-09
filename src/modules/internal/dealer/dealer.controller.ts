import { Request, Response } from "express"
import { onboardDealerService, getAllDealersService } from "./dealer.service"
import { DealerOnboardingSchema } from "./dealer.schema"
import { zodErrorFormatter } from "../../../utils/index"

// export const onboardDealerHandler = async (
//   req: Request<{}, {}, DealerOnboardingPayload>,
//   res: Response
// ) => {
//   const result = await onboardDealerService(req.body, (req as any).user?.id)
//   return res.status(result.status).json(result)
// }

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

export const getAllDealersHandler = async (_req: Request, res: Response) => {
  const result = await getAllDealersService()
  return res.status(result.status).json(result)
}
