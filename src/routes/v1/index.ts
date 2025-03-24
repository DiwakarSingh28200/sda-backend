import { Router } from "express";
import departmentRoutes from "./departmentRoutes";
import roleRoutes from "./roleRoutes";
import authRoutes from "./authRoutes";
import permissionRoutes from "./permissionRoutes";
import employeeRoleRoutes from "./employeeRoleRoutes"; 
import rolePermissionRoutes from "./rolePermissionRoutes";
// import employeeRoutes from "./employeeRoutes";
import employeesRoutes from "./employeesRoutes";
import approvalsRoutes from "./approvalsRoutes";
import auditLogsRoutes from "./auditLogsRoutes";



const router = Router();

router.use("/departments", departmentRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/employee-roles", employeeRoleRoutes);
router.use("/role-permissions", rolePermissionRoutes); 
router.use("/employees", employeesRoutes);
router.use("/approvals", approvalsRoutes);
router.use("/auth", authRoutes);
router.use("/audit-logs", auditLogsRoutes);
// router.use("/dealers", dealerRoutes); // Future
// router.use("/customers", customerRoutes); // Future

export default router;
