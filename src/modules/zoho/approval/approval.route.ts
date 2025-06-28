import { Router } from "express"
import employeeRoutes from "./employee/employee.route"
import dealerRoutes from "../dealer/dealer.route"
import vendorRoutes from "../vendor/vendor.route.ts"

const router = Router()

router.use("/employee", employeeRoutes)
router.use("/dealers", dealerRoutes)
router.use("/vendors", vendorRoutes)

export default router
