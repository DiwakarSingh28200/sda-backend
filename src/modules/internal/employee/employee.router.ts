import { Router } from "express"
import {
  createEmployee,
  getAllEmployees,
  getEmployeeRoles,
  getEmployeeById,
  getEmployeeByEmplID,
} from "./employee.controller"
import { asyncHandler } from "../../../utils/asyncHandler"
import { authenticateEmployee } from "../../../middleware/auth.middleware"

const router: Router = Router()

router.post("/onboarding", authenticateEmployee, asyncHandler(createEmployee))
router.get("/", asyncHandler(getAllEmployees))
router.get("/:employee_id", asyncHandler(getEmployeeByEmplID))
router.get("/id/:id", asyncHandler(getEmployeeById))
router.get("/:employee_id/roles", asyncHandler(getEmployeeRoles))
export default router
