import express from "express"
import { generateInvoice, generateInvoiceFromSaleIdController } from "./invoice.controller"

const router = express.Router()

router.post("/generate", generateInvoice)
router.get("/generate/:saleId", generateInvoiceFromSaleIdController)

export default router
