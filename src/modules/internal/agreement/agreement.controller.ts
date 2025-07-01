import { Request, Response } from "express"
import { generateDealerAgreement } from "./agreement.service"
import { asyncHandler } from "../../../utils/asyncHandler"

export const generateDealerAgreementController = asyncHandler(
  async (req: Request, res: Response) => {
    const { dealerId } = req.params
    const pdfBuffer = await generateDealerAgreement(dealerId)
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${dealerId}.pdf`,
      "Content-Length": pdfBuffer.length,
    })
    res.send(pdfBuffer)
  }
)
