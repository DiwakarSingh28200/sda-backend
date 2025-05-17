"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerOnboardSchema = void 0;
const zod_1 = require("zod");
exports.CustomerOnboardSchema = zod_1.z.object({
    customer: zod_1.z.object({
        first_name: zod_1.z.string().min(1, "First name is required"),
        last_name: zod_1.z.string().min(1, "Last name is required"),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().length(10, "Phone must be 10 digits"),
        whatsapp_number: zod_1.z.string().length(10).optional(),
        address: zod_1.z.string().min(1, "Address is required"),
        city: zod_1.z.string().min(1, "City is required"),
        district: zod_1.z.string().min(1, "District is required"),
        state: zod_1.z.string().min(1, "State is required"),
        postcode: zod_1.z.string().length(6, "Postcode must be 6 digits"),
        preferred_communication: zod_1.z.array(zod_1.z.string()).min(1),
        agreed_terms: zod_1.z.literal(true), // must be true
        authorized_data_sharing: zod_1.z.boolean(),
        consent_service_updates: zod_1.z.boolean(),
    }),
    vehicle: zod_1.z.object({
        vehicle_company: zod_1.z.string().min(1),
        vehicle_model: zod_1.z.string().min(1),
        vehicle_registration_number: zod_1.z.string().min(1),
        chassis_number: zod_1.z.string().min(1),
        engine_number: zod_1.z.string().min(1),
        vehicle_category: zod_1.z.string().min(1),
        fuel_type: zod_1.z.string().min(1),
        dealer_id: zod_1.z.string().uuid().optional(),
    }),
    rsa_plan: zod_1.z.object({
        plan_id: zod_1.z.string().uuid(),
        plan_duration_years: zod_1.z.string(),
        start_date: zod_1.z.string().refine((v) => !isNaN(Date.parse(v)), {
            message: "Invalid start date",
        }),
        end_date: zod_1.z.string().refine((v) => !isNaN(Date.parse(v)), {
            message: "Invalid end date",
        }),
        paid_amount: zod_1.z.string(),
        sales_by: zod_1.z.string().uuid().optional(),
    }),
});
