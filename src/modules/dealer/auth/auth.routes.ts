import { Router } from "express"
import {
  loginDealerHandler,
  getLoggedInDealerHandler,
  logoutDealerHandler,
} from "./auth.controller"
import { asyncHandler } from "../../../utils/asyncHandler"
import { authenticateDealer } from "../../../middleware/dealerAuth.middleware"

const router = Router()

router.post("/login", asyncHandler(loginDealerHandler))
router.get("/me", authenticateDealer, asyncHandler(getLoggedInDealerHandler))
router.post("/logout", asyncHandler(logoutDealerHandler))

export default router
