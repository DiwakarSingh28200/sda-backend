"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDealersService = exports.onboardDealerService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../../config/db");
const generateDealerId_1 = require("../../../utils/generateDealerId");
const onboardDealerService = async (payload, createdBy) => {
    try {
        const { dealer, finance_info, documents, oems, employees, services, sub_dealerships } = payload;
        const dealer_id = await (0, generateDealerId_1.generateDealerId)({
            state: dealer.state,
            oemCode: oems[0].oem_name,
            isSubDealer: false,
        });
        const dealerNumeric = dealer_id.replace(/[^\d]/g, "");
        // const tempPassword = crypto.randomBytes(6).toString("base64")
        const tempPassword = "Dealer@1234";
        const hashedPassword = await bcrypt_1.default.hash(tempPassword, 10);
        const { data: existingDealer } = await db_1.db
            .from("dealers")
            .select("id")
            .ilike("dealership_name", dealer.dealership_name)
            .eq("city", dealer.city)
            .eq("state", dealer.state)
            .single();
        if (existingDealer) {
            return {
                success: false,
                status: 409,
                message: "Dealer already exists in this location.",
            };
        }
        const { data: insertedDealer, error: dealerError } = await db_1.db
            .from("dealers")
            .insert({
            ...dealer,
            dealer_id,
            created_by: createdBy,
            password: hashedPassword,
            login_enabled: true,
            is_sub_dealer: false,
        })
            .select()
            .single();
        if (dealerError || !insertedDealer) {
            return {
                success: false,
                status: 500,
                message: "Failed to create dealer",
                error: dealerError?.message,
            };
        }
        const dealerId = insertedDealer.id;
        await db_1.db.from("dealer_documents").insert({
            dealer_id: dealerId,
            ...documents,
        });
        await db_1.db.from("dealer_finance_info").insert({
            dealer_id: dealerId,
            ...finance_info,
        });
        await db_1.db.from("dealer_oems").insert(oems.map((oem) => ({
            dealer_id: dealerId,
            oem_name: oem.oem_name,
            vehicle_segment: oem.vehicle_segment,
        })));
        if (employees?.length) {
            const employeeRecords = await Promise.all(employees.map(async (emp) => {
                const empId = await (0, generateDealerId_1.generateDealerEmployeeId)(dealerNumeric);
                return {
                    ...emp,
                    name: `${emp.name}`,
                    employee_id: empId,
                    dealer_id: dealerId,
                    password: "DealerEmp@1234",
                    login_enabled: false,
                };
            }));
            await db_1.db.from("dealer_employees").insert(employeeRecords);
        }
        if (services?.length) {
            await db_1.db.from("dealer_services").insert(services.map((s) => ({ ...s, dealer_id: dealerId })));
        }
        if (sub_dealerships?.length) {
            const subDealerRecords = await Promise.all(sub_dealerships.map((sub, i) => ({
                ...sub,
                dealer_id: `${dealer_id}S${String(i + 1).padStart(3, "0")}`,
                parent_dealer_id: dealerId,
                is_sub_dealer: true,
                created_by: createdBy,
                login_enabled: false,
                password: hashedPassword,
            })));
            await db_1.db.from("dealers").insert(subDealerRecords);
        }
        await db_1.db.from("audit_logs").insert({
            entity_type: "dealer",
            reference_id: dealerId,
            action: "dealer_onboarding_requested",
            performed_by: createdBy,
            remarks: `Created onboarding request for ${dealer.dealership_name}`,
        });
        return {
            success: true,
            status: 201,
            message: "Dealer onboarded successfully",
            data: { dealer_id },
        };
    }
    catch (err) {
        console.error(err);
        return {
            success: false,
            status: 500,
            message: "Unexpected error",
            error: err.message,
        };
    }
};
exports.onboardDealerService = onboardDealerService;
const getAllDealersService = async () => {
    const { data, error } = await db_1.db
        .from("dealers")
        .select("id, dealer_id, dealership_name, dealership_type, city, state, owner_name, operations_contact_phone, email, login_enabled, created_at")
        .order("created_at", { ascending: false });
    if (error) {
        return {
            success: false,
            status: 500,
            message: "Failed to fetch dealers",
            error: error.message,
        };
    }
    return {
        success: true,
        status: 200,
        message: "Dealers fetched successfully",
        data,
    };
};
exports.getAllDealersService = getAllDealersService;
