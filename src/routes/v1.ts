import { Router } from "express"
import authRoutes from "../modules/internal/auth/auth.routes"
import walletRoutes from "../modules/internal/wallet/wallet.routes"
import employeeRoutes from "../modules/internal/employee/employee.router"
import dealerRoutes from "../modules/internal/dealer/dealer.routes"
import otpRoutes from "../modules/otp/otp.router"
import vendorRoutes from "../modules/internal/vendor/vendor.router"
import invoiceRoutes from "../modules/internal/invoice/invoice.routes"
import agreementRoutes from "../modules/internal/agreement/agreement.route"
// import dealerRoutes from "@/modules/dealer/dealer.routes";
// import { authenticateEmployee } from "@/middleware/authMiddleware";

const router = Router()

router.use("/auth", authRoutes) // public routes
router.use("/employees", employeeRoutes)
router.use("/dealers", dealerRoutes)
// router.use(authenticateEmployee); // protect below
// router.use("/dealers", dealerRoutes);

router.use("/vendors", vendorRoutes)

router.use("/wallet", walletRoutes)

// OTP routes
router.use("/otp", otpRoutes)

// Invoice routes
router.use("/invoice", invoiceRoutes)

// Agreement routes
router.use("/agreement", agreementRoutes)

export default router
