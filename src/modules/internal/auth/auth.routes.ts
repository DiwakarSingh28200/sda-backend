import { Router } from "express"
import {
  loginEmployeeHandler,
  getAllEmployeesHandler,
  getLoggedInUserHandler,
  logoutEmployeeHandler,
} from "./auth.controller"
import { asyncHandler } from "../../../utils/asyncHandler"
import { authenticateEmployee } from "../../../middleware/auth.middleware"

const router = Router()

router.post("/login", asyncHandler(loginEmployeeHandler))
router.get("/employees", asyncHandler(getAllEmployeesHandler))
router.get("/me", authenticateEmployee, asyncHandler(getLoggedInUserHandler))
router.post("/logout", asyncHandler(logoutEmployeeHandler))

export default router
