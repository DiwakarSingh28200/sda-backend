"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDealersHandler = exports.onboardDealerHandler = void 0;
const dealer_service_1 = require("./dealer.service");
const dealer_schema_1 = require("./dealer.schema");
// export const onboardDealerHandler = async (
//   req: Request<{}, {}, DealerOnboardingPayload>,
//   res: Response
// ) => {
//   const result = await onboardDealerService(req.body, (req as any).user?.id)
//   return res.status(result.status).json(result)
// }
const onboardDealerHandler = async (req, res) => {
    const parsed = dealer_schema_1.DealerOnboardingSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: parsed.error.flatten().fieldErrors,
        });
    }
    const result = await (0, dealer_service_1.onboardDealerService)(parsed.data, req.user?.id);
    return res.status(result.status).json(result);
};
exports.onboardDealerHandler = onboardDealerHandler;
const getAllDealersHandler = async (_req, res) => {
    const result = await (0, dealer_service_1.getAllDealersService)();
    return res.status(result.status).json(result);
};
exports.getAllDealersHandler = getAllDealersHandler;
