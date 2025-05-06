import { Router } from "express"
import departmentRoutes from "./departmentRoutes"
import roleRoutes from "./roleRoutes"
import authRoutes from "./authRoutes"
import permissionRoutes from "./permissionRoutes"
import employeeRoleRoutes from "./employeeRoleRoutes"
import rolePermissionRoutes from "./rolePermissionRoutes"
// import employeeRoutes from "./employeeRoutes";
import employeesRoutes from "./employeesRoutes"
import approvalsRoutes from "./approvalsRoutes"
import auditLogsRoutes from "./auditLogsRoutes"
import notificationRoutes from "./notificationRoutes"
import approvalActionsRoutes from "./approvalActions"
import approvalInstanceRoutes from "./approvalInstanceRoutes"
import dealerRoutes from "./dealerRoutes"
import rsaPlanRoutes from "./rsaPlanRoutes"
import { authenticateEmployee } from "../../middleware/authMeddleware"
import { asyncHandler } from "../../middleware/asyncHandler"

const router = Router()
router.use("/auth", authRoutes)

// Apply middleware to all routes below
router.use(asyncHandler(authenticateEmployee))

router.use("/departments", departmentRoutes)
router.use("/roles", roleRoutes)
router.use("/permissions", permissionRoutes)
router.use("/employee-roles", employeeRoleRoutes)
router.use("/role-permissions", rolePermissionRoutes)
router.use("/employees", employeesRoutes)
router.use("/approvals", approvalsRoutes)

router.use("/audit-logs", auditLogsRoutes)
router.use("/notifications", notificationRoutes)
router.use("/approval-actions", approvalActionsRoutes)
router.use("/approval-instances", approvalInstanceRoutes)

router.use("/dealers", dealerRoutes)
// router.use("/customers", customerRoutes); // Future
router.use("/rsa-plan", rsaPlanRoutes)

export default router
