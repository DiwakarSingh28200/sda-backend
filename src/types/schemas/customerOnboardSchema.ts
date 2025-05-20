import { z } from "zod"

export const CustomerOnboardSchema = z.object({
  customer: z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().length(10),
    whatsapp_number: z.string().length(10).optional(),
    address_line: z.string(),
    city: z.string(),
    district: z.string(),
    state: z.string(),
    postcode: z.string().length(6),
    preferred_communication: z.array(z.enum(["sms", "email", "whatsapp"])),
    agreed_terms: z.boolean(),
    authorized_data_sharing: z.boolean(),
    consent_service_updates: z.boolean(),
  }),
  vehicle: z.object({
    vehicle_company: z.string(),
    vehicle_model: z.string(),
    vehicle_registration_number: z.string(),
    chassis_number: z.string(),
    engine_number: z.string(),
    vehicle_category: z.string(),
    fuel_type: z.string(),
    dealer_id: z.string().uuid(),
  }),
  rsa_plan: z.object({
    plan_id: z.string().uuid(),
    plan_duration_years: z.number().int().min(1).max(3),
    start_date: z.string(), // ISO date
    plan_price: z.number().min(0),
    sales_by: z.string().uuid(),
  }),
})

export type CustomerOnboardInput = z.infer<typeof CustomerOnboardSchema>
