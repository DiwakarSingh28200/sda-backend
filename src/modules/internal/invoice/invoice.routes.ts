import express from "express"
import { generateInvoice } from "./invoice.controller"

const router = express.Router()

router.post("/generate", generateInvoice)

export default router
