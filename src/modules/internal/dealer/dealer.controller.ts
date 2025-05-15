import { Request, Response } from "express"
import { onboardDealerService, getAllDealersService } from "./dealer.service"
import { DealerOnboardingSchema } from "./dealer.schema"

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
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: parsed.error.flatten().fieldErrors,
    })
  }

  const result = await onboardDealerService(parsed.data, (req as any).user?.id)
  return res.status(result.status).json(result)
}

export const getAllDealersHandler = async (_req: Request, res: Response) => {
  const result = await getAllDealersService()
  return res.status(result.status).json(result)
}
