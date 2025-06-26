import { Router } from "express"
import { getAllPendingEmployeesController, onboardEmployeeController } from "./employee.controller"

const router = Router()

router.post("/onboard", onboardEmployeeController)
router.get("/pending", getAllPendingEmployeesController)

export default router
