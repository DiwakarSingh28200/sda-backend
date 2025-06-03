"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDealerSalesHandler = void 0;
const sales_service_1 = require("./sales.service");
const getDealerSalesHandler = async (req, res) => {
    const dealer_id = req.query.dealer_id;
    const employee_id = req.query.employee_id;
    console.log(req.query);
    if (!dealer_id) {
        return res.status(400).json({
            success: false,
            message: "Missing dealer_id",
        });
    }
    const data = await (0, sales_service_1.getDealerSales)(dealer_id.toString(), employee_id?.toString());
    return res.status(200).json({
        success: true,
        message: "Sales fetched successfully",
        data,
    });
};
exports.getDealerSalesHandler = getDealerSalesHandler;
