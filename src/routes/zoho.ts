import { Router } from "express"
import employeeRoutes from "../modules/zoho/employee/employee.route"
import approvalRoutes from "../modules/zoho/approval/approval.route"
import dealerRoutes from "../modules/zoho/dealer/dealer.route"
import vendorRoutes from "../modules/zoho/vendor/vendor.route.ts"
import agreementRoutes from "../modules/zoho/agreement/agreement.route"

const router = Router()

router.use("/employee", employeeRoutes)
router.use("/approval", approvalRoutes)
router.use("/dealers", dealerRoutes)
router.use("/vendors", vendorRoutes)
router.use("/agreement", agreementRoutes)

export default router
