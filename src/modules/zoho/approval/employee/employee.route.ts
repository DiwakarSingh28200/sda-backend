import { Router } from "express"
import { approveEmployeeController, rejectEmployeeController } from "./employee.controller"

const router = Router()

router.get("/:id/approve", approveEmployeeController)
router.get("/:id/reject", rejectEmployeeController)

export default router
