import { Router } from "express"
import { onboardEmployeeController } from "./employee.controller"

const router = Router()

router.post("/onboard", onboardEmployeeController)

export default router
