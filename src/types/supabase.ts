export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      approval_flows: {
        Row: {
          approval_type_id: string
          created_at: string | null
          id: string
          is_final: boolean | null
          role_required: string
          step_name: string | null
          step_number: number
        }
        Insert: {
          approval_type_id: string
          created_at?: string | null
          id?: string
          is_final?: boolean | null
          role_required: string
          step_name?: string | null
          step_number: number
        }
        Update: {
          approval_type_id?: string
          created_at?: string | null
          id?: string
          is_final?: boolean | null
          role_required?: string
          step_name?: string | null
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "approval_flows_approval_type_id_fkey"
            columns: ["approval_type_id"]
            isOneToOne: false
            referencedRelation: "approval_types"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_instances: {
        Row: {
          approval_type_id: string | null
          created_at: string | null
          current_step: number | null
          id: string
          metadata: Json | null
          reference_id: string
          requested_by: string | null
          status: string | null
        }
        Insert: {
          approval_type_id?: string | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          metadata?: Json | null
          reference_id: string
          requested_by?: string | null
          status?: string | null
        }
        Update: {
          approval_type_id?: string | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          metadata?: Json | null
          reference_id?: string
          requested_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_instances_approval_type_id_fkey"
            columns: ["approval_type_id"]
            isOneToOne: false
            referencedRelation: "approval_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_instances_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_steps: {
        Row: {
          assigned_to: string | null
          comment: string | null
          id: string
          instance_id: string | null
          performed_at: string | null
          performed_by: string | null
          role: string | null
          status: string | null
          step_number: number | null
        }
        Insert: {
          assigned_to?: string | null
          comment?: string | null
          id?: string
          instance_id?: string | null
          performed_at?: string | null
          performed_by?: string | null
          role?: string | null
          status?: string | null
          step_number?: number | null
        }
        Update: {
          assigned_to?: string | null
          comment?: string | null
          id?: string
          instance_id?: string | null
          performed_at?: string | null
          performed_by?: string | null
          role?: string | null
          status?: string | null
          step_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_steps_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_steps_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "approval_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_steps_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      approvals: {
        Row: {
          approval_comment: string | null
          approval_status: string | null
          assigned_to: string
          created_at: string | null
          id: string
          is_archived: boolean | null
          metadata: Json | null
          reference_id: string
          request_type_id: string
          requested_by: string
          step_number: number | null
          updated_at: string | null
        }
        Insert: {
          approval_comment?: string | null
          approval_status?: string | null
          assigned_to: string
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          metadata?: Json | null
          reference_id: string
          request_type_id: string
          requested_by: string
          step_number?: number | null
          updated_at?: string | null
        }
        Update: {
          approval_comment?: string | null
          approval_status?: string | null
          assigned_to?: string
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          metadata?: Json | null
          reference_id?: string
          request_type_id?: string
          requested_by?: string
          step_number?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approvals_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_request_type_id_fkey"
            columns: ["request_type_id"]
            isOneToOne: false
            referencedRelation: "approval_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_type: string
          id: string
          performed_by: string
          reference_id: string
          remarks: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_type: string
          id?: string
          performed_by: string
          reference_id: string
          remarks?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_type?: string
          id?: string
          performed_by?: string
          reference_id?: string
          remarks?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      contact: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          message: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          message?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          message?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      customer_logins: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          otp_verified: boolean
          password_hash: string
          phone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          otp_verified?: boolean
          password_hash: string
          phone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          otp_verified?: boolean
          password_hash?: string
          phone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_logins_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          agreed_terms: boolean
          authorized_data_sharing: boolean
          city: string | null
          consent_service_updates: boolean
          created_at: string | null
          dealer_id: string | null
          district: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string
          postcode: string | null
          preferred_communication: string[] | null
          state: string | null
          whatsapp_number: string | null
        }
        Insert: {
          address?: string | null
          agreed_terms?: boolean
          authorized_data_sharing?: boolean
          city?: string | null
          consent_service_updates?: boolean
          created_at?: string | null
          dealer_id?: string | null
          district?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone: string
          postcode?: string | null
          preferred_communication?: string[] | null
          state?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          address?: string | null
          agreed_terms?: boolean
          authorized_data_sharing?: boolean
          city?: string | null
          consent_service_updates?: boolean
          created_at?: string | null
          dealer_id?: string | null
          district?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          postcode?: string | null
          preferred_communication?: string[] | null
          state?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_documents: {
        Row: {
          additional_docs: Json | null
          address_proof: string | null
          dealer_id: string | null
          gst_certificate: string | null
          id: string
          incorporation_certificate: string | null
          pan_card_file: string | null
        }
        Insert: {
          additional_docs?: Json | null
          address_proof?: string | null
          dealer_id?: string | null
          gst_certificate?: string | null
          id?: string
          incorporation_certificate?: string | null
          pan_card_file?: string | null
        }
        Update: {
          additional_docs?: Json | null
          address_proof?: string | null
          dealer_id?: string | null
          gst_certificate?: string | null
          id?: string
          incorporation_certificate?: string | null
          pan_card_file?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_documents_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_employees: {
        Row: {
          contact_number: string | null
          created_at: string | null
          dealer_id: string
          email: string | null
          employee_id: string
          id: string
          login_enabled: boolean | null
          name: string
          password: string
          role: string | null
        }
        Insert: {
          contact_number?: string | null
          created_at?: string | null
          dealer_id: string
          email?: string | null
          employee_id: string
          id?: string
          login_enabled?: boolean | null
          name: string
          password: string
          role?: string | null
        }
        Update: {
          contact_number?: string | null
          created_at?: string | null
          dealer_id?: string
          email?: string | null
          employee_id?: string
          id?: string
          login_enabled?: boolean | null
          name?: string
          password?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_employees_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_finance_info: {
        Row: {
          account_number: string | null
          bank_name: string | null
          cancelled_cheque_file: string | null
          dealer_id: string | null
          finance_contact_email: string | null
          finance_contact_name: string | null
          finance_contact_phone: string | null
          id: string
          ifsc_code: string | null
        }
        Insert: {
          account_number?: string | null
          bank_name?: string | null
          cancelled_cheque_file?: string | null
          dealer_id?: string | null
          finance_contact_email?: string | null
          finance_contact_name?: string | null
          finance_contact_phone?: string | null
          id?: string
          ifsc_code?: string | null
        }
        Update: {
          account_number?: string | null
          bank_name?: string | null
          cancelled_cheque_file?: string | null
          dealer_id?: string | null
          finance_contact_email?: string | null
          finance_contact_name?: string | null
          finance_contact_phone?: string | null
          id?: string
          ifsc_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_finance_info_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_oems: {
        Row: {
          dealer_id: string | null
          id: string
          oem_name: string | null
          vehicle_segment: string | null
        }
        Insert: {
          dealer_id?: string | null
          id?: string
          oem_name?: string | null
          vehicle_segment?: string | null
        }
        Update: {
          dealer_id?: string | null
          id?: string
          oem_name?: string | null
          vehicle_segment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_oems_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_services: {
        Row: {
          available_days: string[] | null
          dealer_id: string | null
          fixed_distance_charge: number | null
          id: string
          is_24x7: boolean | null
          night_price: number | null
          operation_location: string | null
          price_list_file: string | null
          price_per_km: number | null
          price_per_service: number | null
          repair_on_site: boolean | null
          repair_price: number | null
          rsa_support: boolean | null
          service_name: string | null
          time_end: string | null
          time_start: string | null
        }
        Insert: {
          available_days?: string[] | null
          dealer_id?: string | null
          fixed_distance_charge?: number | null
          id?: string
          is_24x7?: boolean | null
          night_price?: number | null
          operation_location?: string | null
          price_list_file?: string | null
          price_per_km?: number | null
          price_per_service?: number | null
          repair_on_site?: boolean | null
          repair_price?: number | null
          rsa_support?: boolean | null
          service_name?: string | null
          time_end?: string | null
          time_start?: string | null
        }
        Update: {
          available_days?: string[] | null
          dealer_id?: string | null
          fixed_distance_charge?: number | null
          id?: string
          is_24x7?: boolean | null
          night_price?: number | null
          operation_location?: string | null
          price_list_file?: string | null
          price_per_km?: number | null
          price_per_service?: number | null
          repair_on_site?: boolean | null
          repair_price?: number | null
          rsa_support?: boolean | null
          service_name?: string | null
          time_end?: string | null
          time_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_services_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_sub_dealerships: {
        Row: {
          address: string | null
          contact: string | null
          dealer_id: string | null
          id: string
          name: string | null
          oems: string[] | null
        }
        Insert: {
          address?: string | null
          contact?: string | null
          dealer_id?: string | null
          id?: string
          name?: string | null
          oems?: string[] | null
        }
        Update: {
          address?: string | null
          contact?: string | null
          dealer_id?: string | null
          id?: string
          name?: string | null
          oems?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_sub_dealerships_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealers: {
        Row: {
          annual_revenue: string | null
          city: string | null
          created_at: string | null
          created_by: string | null
          dealer_id: string | null
          dealership_name: string | null
          dealership_type: string | null
          email: string | null
          escalation_contact: string | null
          escalation_email: string | null
          escalation_name: string | null
          gps_location: string | null
          gst_number: string | null
          id: string
          is_contact_verified: boolean | null
          is_email_verified: boolean | null
          is_master_dealer: boolean | null
          is_sub_dealer: boolean | null
          login_enabled: boolean | null
          oems: string[] | null
          operations_contact_alt: string | null
          operations_contact_name: string | null
          operations_contact_phone: string | null
          owner_contact: string | null
          owner_email: string | null
          owner_name: string | null
          pan_number: string | null
          parent_dealer_id: string | null
          password: string | null
          pincode: string | null
          registered_address: string | null
          state: string | null
          support_contact: string | null
          vehicle_types: string[] | null
        }
        Insert: {
          annual_revenue?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          dealer_id?: string | null
          dealership_name?: string | null
          dealership_type?: string | null
          email?: string | null
          escalation_contact?: string | null
          escalation_email?: string | null
          escalation_name?: string | null
          gps_location?: string | null
          gst_number?: string | null
          id?: string
          is_contact_verified?: boolean | null
          is_email_verified?: boolean | null
          is_master_dealer?: boolean | null
          is_sub_dealer?: boolean | null
          login_enabled?: boolean | null
          oems?: string[] | null
          operations_contact_alt?: string | null
          operations_contact_name?: string | null
          operations_contact_phone?: string | null
          owner_contact?: string | null
          owner_email?: string | null
          owner_name?: string | null
          pan_number?: string | null
          parent_dealer_id?: string | null
          password?: string | null
          pincode?: string | null
          registered_address?: string | null
          state?: string | null
          support_contact?: string | null
          vehicle_types?: string[] | null
        }
        Update: {
          annual_revenue?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          dealer_id?: string | null
          dealership_name?: string | null
          dealership_type?: string | null
          email?: string | null
          escalation_contact?: string | null
          escalation_email?: string | null
          escalation_name?: string | null
          gps_location?: string | null
          gst_number?: string | null
          id?: string
          is_contact_verified?: boolean | null
          is_email_verified?: boolean | null
          is_master_dealer?: boolean | null
          is_sub_dealer?: boolean | null
          login_enabled?: boolean | null
          oems?: string[] | null
          operations_contact_alt?: string | null
          operations_contact_name?: string | null
          operations_contact_phone?: string | null
          owner_contact?: string | null
          owner_email?: string | null
          owner_name?: string | null
          pan_number?: string | null
          parent_dealer_id?: string | null
          password?: string | null
          pincode?: string | null
          registered_address?: string | null
          state?: string | null
          support_contact?: string | null
          vehicle_types?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "dealers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealers_parent_dealer_id_fkey"
            columns: ["parent_dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_roles: {
        Row: {
          assigned_by: string
          created_at: string | null
          employee_id: string | null
          id: string
          role_id: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_by: string
          created_at?: string | null
          employee_id?: string | null
          id?: string
          role_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_by?: string
          created_at?: string | null
          employee_id?: string | null
          id?: string
          role_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_roles_user_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          aadhar_id: string
          address: string
          bank_account: string
          created_at: string | null
          created_by: string | null
          department_id: string
          dob: string
          email: string
          emergency_contact: string
          employee_id: string
          employment_type: Database["public"]["Enums"]["employment_type_enum"]
          first_name: string
          gender: Database["public"]["Enums"]["gender_enum"]
          id: string
          ifsc_code: string
          last_name: string
          pancard: string
          password: string
          phone: string
          provident_fund: number | null
          reporting_manager: string | null
          role_id: string
          salary: number
          status: string | null
          tax_deductions: number | null
        }
        Insert: {
          aadhar_id: string
          address: string
          bank_account: string
          created_at?: string | null
          created_by?: string | null
          department_id: string
          dob: string
          email: string
          emergency_contact: string
          employee_id: string
          employment_type: Database["public"]["Enums"]["employment_type_enum"]
          first_name: string
          gender: Database["public"]["Enums"]["gender_enum"]
          id?: string
          ifsc_code: string
          last_name: string
          pancard: string
          password: string
          phone: string
          provident_fund?: number | null
          reporting_manager?: string | null
          role_id: string
          salary: number
          status?: string | null
          tax_deductions?: number | null
        }
        Update: {
          aadhar_id?: string
          address?: string
          bank_account?: string
          created_at?: string | null
          created_by?: string | null
          department_id?: string
          dob?: string
          email?: string
          emergency_contact?: string
          employee_id?: string
          employment_type?: Database["public"]["Enums"]["employment_type_enum"]
          first_name?: string
          gender?: Database["public"]["Enums"]["gender_enum"]
          id?: string
          ifsc_code?: string
          last_name?: string
          pancard?: string
          password?: string
          phone?: string
          provident_fund?: number | null
          reporting_manager?: string | null
          role_id?: string
          salary?: number
          status?: string | null
          tax_deductions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_reporting_manager_fkey"
            columns: ["reporting_manager"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiry: {
        Row: {
          company_name: string | null
          created_at: string
          facility_address: string | null
          facility_city: string | null
          facility_state: string | null
          facility_zip: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          prev_applied: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          facility_address?: string | null
          facility_city?: string | null
          facility_state?: string | null
          facility_zip?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          prev_applied?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          facility_address?: string | null
          facility_city?: string | null
          facility_state?: string | null
          facility_zip?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          prev_applied?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          message: string
          metadata: Json | null
          recipient_id: string
          reference_id: string | null
          sender_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          recipient_id: string
          reference_id?: string | null
          sender_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          recipient_id?: string
          reference_id?: string | null
          sender_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "permissions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          assigned_by: string
          created_at: string | null
          id: string
          permission_id: string | null
          role_id: string | null
        }
        Insert: {
          assigned_by: string
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Update: {
          assigned_by?: string
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_by: string
          department_id: string | null
          description: string
          id: string
          role: string
          role_name: string
        }
        Insert: {
          created_by: string
          department_id?: string | null
          description: string
          id?: string
          role: string
          role_name: string
        }
        Update: {
          created_by?: string
          department_id?: string | null
          description?: string
          id?: string
          role?: string
          role_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      rsa_features: {
        Row: {
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      rsa_plan_features: {
        Row: {
          feature_id: string
          plan_id: string
        }
        Insert: {
          feature_id: string
          plan_id: string
        }
        Update: {
          feature_id?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsa_plan_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "rsa_features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsa_plan_features_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "rsa_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      rsa_plan_sales: {
        Row: {
          created_at: string | null
          dealer_id: string
          end_date: string
          id: string
          paid_amount: number
          plan_duration_years: number
          plan_id: string
          policy_number: string
          sales_by: string
          start_date: string
          status: string | null
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          dealer_id: string
          end_date: string
          id?: string
          paid_amount: number
          plan_duration_years: number
          plan_id: string
          policy_number: string
          sales_by: string
          start_date: string
          status?: string | null
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          dealer_id?: string
          end_date?: string
          id?: string
          paid_amount?: number
          plan_duration_years?: number
          plan_id?: string
          policy_number?: string
          sales_by?: string
          start_date?: string
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsa_plan_sales_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsa_plan_sales_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "rsa_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsa_plan_sales_sales_by_fkey"
            columns: ["sales_by"]
            isOneToOne: false
            referencedRelation: "dealer_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsa_plan_sales_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      rsa_plans: {
        Row: {
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          validity: string
        }
        Insert: {
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          validity: string
        }
        Update: {
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          validity?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          chassis_number: string
          created_at: string | null
          customer_id: string
          dealer_id: string
          engine_number: string
          fuel_type: string
          id: string
          updated_at: string | null
          vehicle_category: string
          vehicle_company: string
          vehicle_model: string
          vehicle_registration_number: string
        }
        Insert: {
          chassis_number: string
          created_at?: string | null
          customer_id: string
          dealer_id: string
          engine_number: string
          fuel_type: string
          id?: string
          updated_at?: string | null
          vehicle_category: string
          vehicle_company: string
          vehicle_model: string
          vehicle_registration_number: string
        }
        Update: {
          chassis_number?: string
          created_at?: string | null
          customer_id?: string
          dealer_id?: string
          engine_number?: string
          fuel_type?: string
          id?: string
          updated_at?: string | null
          vehicle_category?: string
          vehicle_company?: string
          vehicle_model?: string
          vehicle_registration_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_monthly_sales_chart: {
        Args: { input_dealer_id: string }
        Returns: {
          day: string
          count: number
        }[]
      }
      get_plan_type_stats: {
        Args: { dealer_input: string }
        Returns: {
          name: string
          count: number
          percentage: number
        }[]
      }
      get_top_dealer_employees: {
        Args: { dealer_input: string }
        Returns: {
          name: string
          total_customers: number
          total_revenue: number
        }[]
      }
    }
    Enums: {
      employment_type_enum: "full_time" | "part_time" | "contractor"
      gender_enum: "male" | "female" | "other"
      status_enum: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      employment_type_enum: ["full_time", "part_time", "contractor"],
      gender_enum: ["male", "female", "other"],
      status_enum: ["pending", "approved", "rejected"],
    },
  },
} as const
