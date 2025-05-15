import { Router } from "express"
import {
  loginDealerEmployeeHandler,
  getLoggedInDealerEmployeeHandler,
  logoutDealerEmployeeHandler,
} from "./team-auth.controller"
import { asyncHandler } from "../../../utils/asyncHandler"
import { authenticateDealerEmployee } from "../../../middleware/dealerEmployeeAuthMiddleware"

const router = Router()

router.post("/login", asyncHandler(loginDealerEmployeeHandler))
router.get("/me", authenticateDealerEmployee, asyncHandler(getLoggedInDealerEmployeeHandler))
router.post("/logout", asyncHandler(logoutDealerEmployeeHandler))

export default router
