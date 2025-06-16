import { z } from "zod"

export const CustomerOnboardSchema = z.object({
  customer: z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email().optional(),
    phone: z.string().length(10, "Phone must be 10 digits"),
    whatsapp_number: z.string().length(10).optional(),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    district: z.string().min(1, "District is required"),
    state: z.string().min(1, "State is required"),
    postcode: z.string().length(6, "Postcode must be 6 digits"),
    preferred_communication: z.array(z.string()).min(1),
    agreed_terms: z.literal(true), // must be true
    authorized_data_sharing: z.boolean(),
    consent_service_updates: z.boolean(),
  }),

  vehicle: z.object({
    vehicle_company: z.string().min(1),
    vehicle_model: z.string().min(1),
    vehicle_registration_number: z.string().optional(),
    chassis_number: z.string().min(1),
    engine_number: z.string().min(1),
    vehicle_category: z.string().min(1),
    fuel_type: z.string().min(1),
    registration_type: z.string(),
    dealer_id: z.string().uuid().optional(),
  }),

  rsa_plan: z.object({
    plan_id: z.string().uuid(),
    plan_duration_years: z.string(),
    start_date: z.string().refine((v) => !isNaN(Date.parse(v)), {
      message: "Invalid start date",
    }),
    end_date: z.string().refine((v) => !isNaN(Date.parse(v)), {
      message: "Invalid end date",
    }),
    paid_amount: z.string(),
    sales_by: z.string().uuid().optional(),
  }),
  wallet: z.object({
    wallet_type: z.enum(["cash", "credit"]),
  }),
})
