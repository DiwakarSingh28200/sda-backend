import { Router } from "express"
import {
  getComissionInvoiceController,
  createComissionInvoiceController,
} from "./comission-invoice.controller"
import { authenticateDealer } from "../../../../middleware/authMiddleware"

const router = Router()

router.get("/all", authenticateDealer, getComissionInvoiceController)
router.post("/add", authenticateDealer, createComissionInvoiceController)

export default router
