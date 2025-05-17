import { Router } from "express"
import { getDealerSalesHandler } from "./sales.controller"
import { asyncHandler } from "../../../utils/asyncHandler"
import { authenticateDealer } from "../../../middleware/dealerAuth.middleware"
import { authenticateDealerEmployee } from "../../../middleware/dealerEmployeeAuthMiddleware"

const router = Router()

router.get(
  "/",
  (req, res, next) => {
    // ✅ Accept either middleware
    authenticateDealer(req, res, (err) => {
      if (!err && req.dealer) return next()
      authenticateDealerEmployee(req, res, next)
    })
  },
  asyncHandler(getDealerSalesHandler)
)

export default router
