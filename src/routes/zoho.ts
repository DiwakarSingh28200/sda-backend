import { Router } from "express"
import employeeRoutes from "../modules/zoho/employee/employee.route"
import approvalRoutes from "../modules/zoho/approval/approval.route"

const router = Router()

router.use("/employee", employeeRoutes)
router.use("/approval", approvalRoutes)

export default router
