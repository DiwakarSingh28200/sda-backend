import { Router } from "express"
import employeeRoutes from "./employee/employee.route"

const router = Router()

router.use("/employee", employeeRoutes)

export default router
