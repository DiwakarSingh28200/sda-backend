"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanTypeStatsHandler = exports.getTopEmployeesHandler = exports.getSalesChartHandler = exports.getDealerMetricsHandler = void 0;
const dashboard_service_1 = require("./dashboard.service");
const getDealerMetricsHandler = async (req, res) => {
    const { dealer_id } = req.query;
    if (!dealer_id) {
        return res.status(400).json({
            success: false,
            message: "dealer_id is required",
        });
    }
    const data = await (0, dashboard_service_1.getDealerMetricsService)(dealer_id);
    return res.status(200).json({
        success: true,
        message: "Dashboard metrics fetched successfully",
        data,
    });
};
exports.getDealerMetricsHandler = getDealerMetricsHandler;
const getSalesChartHandler = async (req, res) => {
    const { dealer_id, range = "monthly", month, year, } = req.query;
    if (!dealer_id) {
        return res.status(400).json({
            success: false,
            message: "dealer_id is required",
        });
    }
    try {
        const data = await (0, dashboard_service_1.getSalesChartService)({
            dealer_id,
            range,
            month: month ? parseInt(month) : undefined,
            year: year ? parseInt(year) : undefined,
        });
        return res.status(200).json({
            success: true,
            message: "Sales chart fetched successfully",
            data,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch sales chart",
        });
    }
};
exports.getSalesChartHandler = getSalesChartHandler;
const getTopEmployeesHandler = async (req, res) => {
    const { dealer_id } = req.query;
    if (!dealer_id) {
        return res.status(400).json({
            success: false,
            message: "dealer_id is required",
        });
    }
    const data = await (0, dashboard_service_1.getTopEmployeesService)(dealer_id);
    return res.status(200).json({
        success: true,
        message: "Top performing employees fetched successfully",
        data,
    });
};
exports.getTopEmployeesHandler = getTopEmployeesHandler;
const getPlanTypeStatsHandler = async (req, res) => {
    const { dealer_id } = req.query;
    if (!dealer_id) {
        return res.status(400).json({
            success: false,
            message: "dealer_id is required",
        });
    }
    const data = await (0, dashboard_service_1.getPlanTypeStatsService)(dealer_id);
    return res.status(200).json({
        success: true,
        message: "Plan type stats fetched successfully",
        data,
    });
};
exports.getPlanTypeStatsHandler = getPlanTypeStatsHandler;
