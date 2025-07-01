import { Request, Response } from "express"
import { generateDealerAgreement, sendDealerAgreementEmail } from "./agreement.service"
import { asyncHandler } from "../../../utils/asyncHandler"
import { DealerAgreementTemplateData } from "./agreement.type"

export const generateDealerAgreementController = asyncHandler(
  async (req: Request, res: Response) => {
    const { dealerId } = req.params
    const payload = req.body as DealerAgreementTemplateData

    const pdfBuffer = await generateDealerAgreement(dealerId, payload)
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${dealerId}.pdf`,
      "Content-Length": pdfBuffer.toString().length,
    })
    res.send(pdfBuffer)
  }
)

export const sendDealerAgreementEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { dealerId } = req.params
    const payload = req.body as DealerAgreementTemplateData

    const { success, message } = await sendDealerAgreementEmail(dealerId, payload)
    res.status(success ? 200 : 400).json({ success, message })
  }
)
