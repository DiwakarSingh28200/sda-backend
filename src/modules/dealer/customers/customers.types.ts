import { z } from "zod"
import { CustomerOnboardSchema } from "./customers.schema"
import { Database } from "../../../types/supabase"

export type CustomerOnboardInput = z.infer<typeof CustomerOnboardSchema>

export type CustomerInsert = Database["public"]["Tables"]["customers"]["Insert"]
export type VehicleInsert = Database["public"]["Tables"]["vehicles"]["Insert"]
export type RsaPlanSaleInsert = Database["public"]["Tables"]["rsa_plan_sales"]["Insert"]
export type CustomerLoginInsert = Database["public"]["Tables"]["customer_logins"]["Insert"]
