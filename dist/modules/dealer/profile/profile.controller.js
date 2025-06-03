"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDealerProfileHandler = exports.getDealerProfileHandler = void 0;
const profile_service_1 = require("./profile.service");
const getDealerProfileHandler = async (req, res) => {
    const dealer_id = req.dealer?.dealer_id;
    if (!dealer_id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const data = await (0, profile_service_1.getDealerProfileService)(dealer_id);
    return res.status(200).json({
        success: true,
        message: "Dealer profile fetched successfully",
        data,
    });
};
exports.getDealerProfileHandler = getDealerProfileHandler;
const updateDealerProfileHandler = async (req, res) => {
    const dealer_id = req.dealer?.dealer_id;
    if (!dealer_id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
};
exports.updateDealerProfileHandler = updateDealerProfileHandler;
