import express from "express"
import { generateInvoice, generateInvoiceFromSaleIdController } from "./invoice.controller"
import { authenticateDealer } from "../../../middleware/authMiddleware"
import comissionInvoiceRoutes from "./comission/comission-invoice.route"

const router = express.Router()

router.post("/generate", generateInvoice)
router.get("/generate/:saleId", authenticateDealer, generateInvoiceFromSaleIdController)

router.use("/comission", comissionInvoiceRoutes)

export default router
