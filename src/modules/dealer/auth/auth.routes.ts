import { Router } from "express"
import {
  loginDealerHandler,
  getLoggedInDealerHandler,
  logoutDealerHandler,
  resetDealerPasswordHandler,
} from "./auth.controller"
import { asyncHandler } from "../../../utils/asyncHandler"
import { authenticateDealer } from "../../../middleware/dealerAuth.middleware"

const router = Router()

router.post("/login", asyncHandler(loginDealerHandler))
router.get("/me", authenticateDealer, asyncHandler(getLoggedInDealerHandler))
router.post("/logout", asyncHandler(logoutDealerHandler))
router.post("/reset-password", authenticateDealer, asyncHandler(resetDealerPasswordHandler))

export default router
