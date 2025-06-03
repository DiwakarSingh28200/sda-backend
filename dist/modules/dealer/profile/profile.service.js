"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDealerProfileService = void 0;
const db_1 = require("../../../config/db");
const getDealerProfileService = async (dealer_id) => {
    // Step 1: Get actual UUID (id) from dealer_id
    const { data: dealer, error } = await db_1.db
        .from("dealers")
        .select("*")
        .eq("dealer_id", dealer_id)
        .single();
    if (error || !dealer)
        throw new Error("Dealer not found");
    const dealerID = dealer.id;
    // ⛔️ Remove sensitive fields
    const { password, ...safeDealer } = dealer;
    // Step 2: Fetch all other data using dealerID
    const [documents, finance_info, sub_dealerships, employees] = await Promise.all([
        db_1.db.from("dealer_documents").select("*").eq("dealer_id", dealerID).single(),
        db_1.db.from("dealer_finance_info").select("*").eq("dealer_id", dealerID).single(),
        db_1.db
            .from("dealers")
            .select("id, dealer_id, dealership_name, registered_address, city,state, pincode, oems, owner_name, owner_contact, owner_email, vehicle_types, created_by")
            .eq("parent_dealer_id", dealerID),
        db_1.db
            .from("dealer_employees")
            .select("name, role, contact_number, email")
            .eq("dealer_id", dealerID),
    ]);
    return {
        dealer: safeDealer,
        documents: documents.data,
        finance_info: finance_info.data,
        oems: safeDealer.oem,
        sub_dealerships: sub_dealerships.data,
        employees: employees.data,
    };
};
exports.getDealerProfileService = getDealerProfileService;
