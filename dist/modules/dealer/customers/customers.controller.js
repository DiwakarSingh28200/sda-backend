"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCustomersHandler = exports.createCustomerHandler = void 0;
const customers_service_1 = require("./customers.service");
const customers_schema_1 = require("./customers.schema");
const humanizeKey = (path) => {
    const field = path[path.length - 1];
    return field
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (l) => l.toUpperCase()); // capitalize
};
const createCustomerHandler = async (req, res) => {
    try {
        console.log("req.body", req.body);
        const parsed = customers_schema_1.CustomerOnboardSchema.safeParse(req.body);
        if (!parsed.success) {
            const messages = [];
            for (const issue of parsed.error.issues) {
                const label = humanizeKey(issue.path);
                messages.push(`${label}: ${issue.message}`);
            }
            return res.status(400).json({
                success: false,
                message: messages.join(", "),
            });
        }
        const payload = {
            ...parsed.data,
        };
        const dealerEmployeeId = req.dealerEmployee?.id;
        const result = await (0, customers_service_1.createCustomerService)(payload, dealerEmployeeId);
        return res.status(result.status).json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.createCustomerHandler = createCustomerHandler;
const getAllCustomersHandler = async (req, res) => {
    const id = req.dealerEmployee?.dealer_id;
    // console.log("dealer", id, req.dealerEmployee)
    if (!id)
        return res.status(400).json({ success: false, message: "Dealer Id is required" });
    try {
        const customers = await (0, customers_service_1.getAllCustomersService)(id);
        return res.status(200).json({ success: true, data: customers });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to fetch customers" });
    }
};
exports.getAllCustomersHandler = getAllCustomersHandler;
