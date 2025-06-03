"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDealerEmployeeHandler = exports.updateDealerEmployeeHandler = exports.addDealerEmployeeHandler = exports.getDealerEmployeeByDealerIDHandler = void 0;
const employee_service_1 = require("./employee.service");
const getDealerEmployeeByDealerIDHandler = async (req, res) => {
    const { dealer_id } = req.params;
    const result = await (0, employee_service_1.getDealerEmployeeByDealerIDService)(dealer_id);
    return res.status(200).json({
        status: 200,
        success: true,
        message: "Dealer employee fetched successfully",
        data: result,
    });
};
exports.getDealerEmployeeByDealerIDHandler = getDealerEmployeeByDealerIDHandler;
const addDealerEmployeeHandler = async (req, res) => {
    const { name, email, role, contact_number } = req.body;
    const dealerId = req.dealer?.id;
    const dealer_id = req.dealer?.dealer_id;
    if (!name || !email || !role || !contact_number) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "All fields are required",
        });
    }
    const result = await (0, employee_service_1.addDealerEmployeeService)(dealerId, dealer_id, name, email, role, contact_number);
    if (!result) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Failed to add employee",
        });
    }
    return res.status(result.status).json({
        status: result.status,
        success: result.success,
        message: result.message,
        data: result.data,
    });
};
exports.addDealerEmployeeHandler = addDealerEmployeeHandler;
const updateDealerEmployeeHandler = async (req, res) => {
    const { employee_id } = req.params;
    const { name, email, role, contact_number } = req.body;
    console.log("employee_id", employee_id);
    console.log("Body", req.body);
    const dealerId = req.dealer?.id;
    console.log("dealerId", dealerId);
    if (!dealerId || !name || !email || !role || !contact_number || !employee_id) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "All fields are required",
        });
    }
    const result = await (0, employee_service_1.updateDealerEmployeeService)(dealerId, employee_id, name, email, role, contact_number);
    return res.status(result.status).json({
        status: result.status,
        success: result.success,
        message: result.message,
        data: result.data,
    });
};
exports.updateDealerEmployeeHandler = updateDealerEmployeeHandler;
const deleteDealerEmployeeHandler = async (req, res) => {
    const { employee_id } = req.params;
    const dealerId = req.dealer?.id;
    if (!dealerId || !employee_id) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "All fields are required",
        });
    }
    const result = await (0, employee_service_1.deleteDealerEmployeeService)(dealerId, employee_id);
    return res.status(result.status).json({
        status: result.status,
        success: result.success,
        message: result.message,
        data: result.data,
    });
};
exports.deleteDealerEmployeeHandler = deleteDealerEmployeeHandler;
