import { Router } from "express";
import { onboardDealerHandler, getAllDealersHandler } from "./dealer.controller";
import { asyncHandler } from "@/middleware/asyncHandler";

const router = Router();

router.post("/onboard", asyncHandler(onboardDealerHandler));
router.get("/all", asyncHandler(getAllDealersHandler));

export default router;
