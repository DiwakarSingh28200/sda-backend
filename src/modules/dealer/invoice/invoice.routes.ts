import express from "express"
import { generateInvoice, generateInvoiceFromSaleIdController } from "./invoice.controller"
import { authenticateDealer } from "../../../middleware/authMiddleware"

const router = express.Router()

router.post("/generate", generateInvoice)
router.get("/generate/:saleId", authenticateDealer, generateInvoiceFromSaleIdController)

export default router
