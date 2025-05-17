"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealerOnboardingSchema = exports.EmployeeSchema = exports.SubDealershipSchema = exports.FinanceInfoSchema = exports.DocumentsSchema = exports.OemSchema = exports.ServiceSchema = exports.DealerSchema = void 0;
const zod_1 = require("zod");
// 🔹 Core Dealer Info
exports.DealerSchema = zod_1.z.object({
    dealership_type: zod_1.z.string().optional(),
    dealership_name: zod_1.z.string().min(1, "Dealership name is required"),
    registered_address: zod_1.z.string().min(1, "Address is required"),
    city: zod_1.z.string().min(1),
    state: zod_1.z.string().min(1),
    pincode: zod_1.z.string().min(1),
    gps_location: zod_1.z.string().url().optional(),
    operations_contact_name: zod_1.z.string().min(1),
    operations_contact_phone: zod_1.z.string().min(10),
    email: zod_1.z.string().email("Invalid email"),
    owner_name: zod_1.z.string().min(1),
    owner_contact: zod_1.z.string().min(10),
    owner_email: zod_1.z.string().email(),
    escalation_name: zod_1.z.string().optional(),
    escalation_contact: zod_1.z.string().optional(),
    escalation_email: zod_1.z.string().optional(),
    pan_number: zod_1.z.string().min(10, "PAN number must be 10 characters"),
    gst_number: zod_1.z.string().min(1),
    vehicle_types: zod_1.z.array(zod_1.z.string()).optional(),
    is_rsa_support: zod_1.z.boolean().optional(),
});
// 🔹 Services
exports.ServiceSchema = zod_1.z.object({
    rsa_support: zod_1.z.boolean().optional(),
    operation_location: zod_1.z.string().optional(),
    price_per_service: zod_1.z.number().optional(),
    price_per_km: zod_1.z.number().optional(),
    repair_on_site: zod_1.z.boolean().optional(),
    repair_price: zod_1.z.number().optional(),
    night_price: zod_1.z.number().optional(),
    price_list_file: zod_1.z.string().optional(),
    fixed_distance_charge: zod_1.z.number().optional(),
    is_24x7: zod_1.z.boolean().optional(),
    time_start: zod_1.z.string().optional(),
    time_end: zod_1.z.string().optional(),
    available_days: zod_1.z.array(zod_1.z.string()).optional(),
});
// 🔹 OEMs (vehicle_segment is optional as per frontend)
exports.OemSchema = zod_1.z.object({
    oem_name: zod_1.z.string().min(1),
    vehicle_segment: zod_1.z.string().optional(),
});
// 🔹 Documents
exports.DocumentsSchema = zod_1.z.object({
    gst_certificate: zod_1.z.string().url(),
    pan_card_file: zod_1.z.string().url(),
    address_proof: zod_1.z.string().url(),
});
// 🔹 Finance Info
exports.FinanceInfoSchema = zod_1.z.object({
    bank_name: zod_1.z.string().min(1),
    account_number: zod_1.z.string().min(6),
    ifsc_code: zod_1.z.string().min(6),
    finance_contact_name: zod_1.z.string().min(1),
    finance_contact_email: zod_1.z.string().email(),
    finance_contact_phone: zod_1.z.string().min(10),
    cancelled_cheque_file: zod_1.z.string().url(),
});
// 🔹 Sub Dealerships
exports.SubDealershipSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    contact: zod_1.z.string().min(10),
    address: zod_1.z.string().min(1),
    oem: zod_1.z.array(zod_1.z.string().min(1)).min(1),
});
// 🔹 Employees
exports.EmployeeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    role: zod_1.z.string().optional(),
    contact_number: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
});
// 🔹 Full Dealer Onboarding Payload
exports.DealerOnboardingSchema = zod_1.z.object({
    dealer: exports.DealerSchema,
    services: zod_1.z.array(exports.ServiceSchema).optional(),
    documents: exports.DocumentsSchema,
    finance_info: exports.FinanceInfoSchema,
    oems: zod_1.z.array(exports.OemSchema).min(1, "At least one OEM is required"),
    sub_dealerships: zod_1.z.array(exports.SubDealershipSchema).optional(),
    employees: zod_1.z.array(exports.EmployeeSchema).optional(),
});
