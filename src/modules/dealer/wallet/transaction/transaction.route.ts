import { Router } from "express"
import { getLastFiveWithdrawalsAndAddsController } from "./transaction.controller"
import { authenticateDealer } from "../../../../middleware/authMiddleware"

const router = Router()

router.get(
  "/last-five-withdrawals-and-adds",
  authenticateDealer,
  getLastFiveWithdrawalsAndAddsController
)

export default router
