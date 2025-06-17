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
      bike_models: {
        Row: {
          brand: string
          created_at: string | null
          id: string
          is_active: boolean | null
          model_name: string
        }
        Insert: {
          brand: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          model_name: string
        }
        Update: {
          brand?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          model_name?: string
        }
        Relationships: []
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
      dealer_services: {
        Row: {
          additional_price: number | null
          day_charge: number | null
          dealer_id: string | null
          fixed_distance_charge: number | null
          id: string
          night_charge: number | null
          service_name: string | null
        }
        Insert: {
          additional_price?: number | null
          day_charge?: number | null
          dealer_id?: string | null
          fixed_distance_charge?: number | null
          id?: string
          night_charge?: number | null
          service_name?: string | null
        }
        Update: {
          additional_price?: number | null
          day_charge?: number | null
          dealer_id?: string | null
          fixed_distance_charge?: number | null
          id?: string
          night_charge?: number | null
          service_name?: string | null
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
          oem: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          contact?: string | null
          dealer_id?: string | null
          id?: string
          name?: string | null
          oem?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          contact?: string | null
          dealer_id?: string | null
          id?: string
          name?: string | null
          oem?: string | null
          status?: string | null
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
          available_days: string[] | null
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
          oem: string | null
          operation_location: string | null
          operations_contact_name: string | null
          operations_contact_phone: string | null
          owner_contact: string | null
          owner_email: string | null
          owner_name: string | null
          pan_number: string | null
          parent_dealer_id: string | null
          password: string | null
          pincode: string | null
          price_list_file: string | null
          razorpayx_contact_id: string | null
          registered_address: string | null
          repair_on_site: boolean | null
          state: string | null
          time_end: string | null
          time_start: string | null
          vehicle_types: string[] | null
        }
        Insert: {
          available_days?: string[] | null
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
          oem?: string | null
          operation_location?: string | null
          operations_contact_name?: string | null
          operations_contact_phone?: string | null
          owner_contact?: string | null
          owner_email?: string | null
          owner_name?: string | null
          pan_number?: string | null
          parent_dealer_id?: string | null
          password?: string | null
          pincode?: string | null
          price_list_file?: string | null
          razorpayx_contact_id?: string | null
          registered_address?: string | null
          repair_on_site?: boolean | null
          state?: string | null
          time_end?: string | null
          time_start?: string | null
          vehicle_types?: string[] | null
        }
        Update: {
          available_days?: string[] | null
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
          oem?: string | null
          operation_location?: string | null
          operations_contact_name?: string | null
          operations_contact_phone?: string | null
          owner_contact?: string | null
          owner_email?: string | null
          owner_name?: string | null
          pan_number?: string | null
          parent_dealer_id?: string | null
          password?: string | null
          pincode?: string | null
          price_list_file?: string | null
          razorpayx_contact_id?: string | null
          registered_address?: string | null
          repair_on_site?: boolean | null
          state?: string | null
          time_end?: string | null
          time_start?: string | null
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
          customer_id: string | null
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
          customer_id?: string | null
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
          customer_id?: string | null
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
            foreignKeyName: "rsa_plan_sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
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
      sales: {
        Row: {
          commission_invoice_status: string | null
          created_at: string | null
          customer_id: string | null
          dealer_commission: number | null
          dealer_id: string | null
          id: string
          invoice_url: string | null
          plan_id: string | null
          rsa_plan_sales_id: string | null
          sda_commission: number | null
          tds_amount: number | null
          total_amount: number | null
          wallet_transaction_id: string | null
        }
        Insert: {
          commission_invoice_status?: string | null
          created_at?: string | null
          customer_id?: string | null
          dealer_commission?: number | null
          dealer_id?: string | null
          id?: string
          invoice_url?: string | null
          plan_id?: string | null
          rsa_plan_sales_id?: string | null
          sda_commission?: number | null
          tds_amount?: number | null
          total_amount?: number | null
          wallet_transaction_id?: string | null
        }
        Update: {
          commission_invoice_status?: string | null
          created_at?: string | null
          customer_id?: string | null
          dealer_commission?: number | null
          dealer_id?: string | null
          id?: string
          invoice_url?: string | null
          plan_id?: string | null
          rsa_plan_sales_id?: string | null
          sda_commission?: number | null
          tds_amount?: number | null
          total_amount?: number | null
          wallet_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "rsa_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_rsa_plan_sales_id_fkey"
            columns: ["rsa_plan_sales_id"]
            isOneToOne: false
            referencedRelation: "rsa_plan_sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_wallet_transaction_id_fkey"
            columns: ["wallet_transaction_id"]
            isOneToOne: false
            referencedRelation: "wallet_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      tds_transactions: {
        Row: {
          amount: number | null
          created_at: string | null
          dealer_id: string | null
          id: string
          percent: number | null
          sale_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          dealer_id?: string | null
          id: string
          percent?: number | null
          sale_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          percent?: number | null
          sale_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tds_transactions_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tds_transactions_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
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
          registration_type: string | null
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
          registration_type?: string | null
          updated_at?: string | null
          vehicle_category: string
          vehicle_company: string
          vehicle_model: string
          vehicle_registration_number?: string
        }
        Update: {
          chassis_number?: string
          created_at?: string | null
          customer_id?: string
          dealer_id?: string
          engine_number?: string
          fuel_type?: string
          id?: string
          registration_type?: string | null
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
      vendor_bank_info: {
        Row: {
          account_holder_name: string
          account_number: string
          bank_name: string
          cancelled_cheque_file_path: string | null
          created_at: string | null
          id: string
          ifsc_code: string
          vendor_id: string | null
        }
        Insert: {
          account_holder_name: string
          account_number: string
          bank_name: string
          cancelled_cheque_file_path?: string | null
          created_at?: string | null
          id?: string
          ifsc_code: string
          vendor_id?: string | null
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          bank_name?: string
          cancelled_cheque_file_path?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_bank_info_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_contacts: {
        Row: {
          finance_contact_email: string | null
          finance_contact_name: string | null
          finance_contact_number: string | null
          id: string
          vendor_id: string | null
        }
        Insert: {
          finance_contact_email?: string | null
          finance_contact_name?: string | null
          finance_contact_number?: string | null
          id?: string
          vendor_id?: string | null
        }
        Update: {
          finance_contact_email?: string | null
          finance_contact_name?: string | null
          finance_contact_number?: string | null
          id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_contacts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_documents: {
        Row: {
          address_proof_file_path: string | null
          cancelled_cheque_file_path: string | null
          gst_certificate_file_path: string | null
          gst_number: string | null
          id: string
          pan_card_file_path: string | null
          pan_number: string | null
          vendor_id: string | null
        }
        Insert: {
          address_proof_file_path?: string | null
          cancelled_cheque_file_path?: string | null
          gst_certificate_file_path?: string | null
          gst_number?: string | null
          id?: string
          pan_card_file_path?: string | null
          pan_number?: string | null
          vendor_id?: string | null
        }
        Update: {
          address_proof_file_path?: string | null
          cancelled_cheque_file_path?: string | null
          gst_certificate_file_path?: string | null
          gst_number?: string | null
          id?: string
          pan_card_file_path?: string | null
          pan_number?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_operating_areas: {
        Row: {
          city: string
          contact_number: string | null
          id: string
          latitude: number
          location: unknown | null
          longitude: number
          region: string
          state: string | null
          vendor_id: string | null
        }
        Insert: {
          city: string
          contact_number?: string | null
          id?: string
          latitude: number
          location?: unknown | null
          longitude: number
          region: string
          state?: string | null
          vendor_id?: string | null
        }
        Update: {
          city?: string
          contact_number?: string | null
          id?: string
          latitude?: number
          location?: unknown | null
          longitude?: number
          region?: string
          state?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_operating_areas_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_pricing: {
        Row: {
          id: string
          night_charges: number | null
          night_charges_towing: number | null
          notes: string | null
          price_list_file_path: string | null
          price_per_additional_km: number
          price_per_service: number
          repair_on_site_price: number | null
          vendor_id: string | null
        }
        Insert: {
          id?: string
          night_charges?: number | null
          night_charges_towing?: number | null
          notes?: string | null
          price_list_file_path?: string | null
          price_per_additional_km: number
          price_per_service: number
          repair_on_site_price?: number | null
          vendor_id?: string | null
        }
        Update: {
          id?: string
          night_charges?: number | null
          night_charges_towing?: number | null
          notes?: string | null
          price_list_file_path?: string | null
          price_per_additional_km?: number
          price_per_service?: number
          repair_on_site_price?: number | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_pricing_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_services: {
        Row: {
          additional_price: number | null
          created_at: string | null
          day_charge: number | null
          fixed_distance_charge: number | null
          id: string
          night_charge: number | null
          service_name: string | null
          vendor_id: string | null
        }
        Insert: {
          additional_price?: number | null
          created_at?: string | null
          day_charge?: number | null
          fixed_distance_charge?: number | null
          id?: string
          night_charge?: number | null
          service_name?: string | null
          vendor_id?: string | null
        }
        Update: {
          additional_price?: number | null
          created_at?: string | null
          day_charge?: number | null
          fixed_distance_charge?: number | null
          id?: string
          night_charge?: number | null
          service_name?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_services_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string
          available_days: string[] | null
          city: string
          created_at: string | null
          created_by: string | null
          due_date: string | null
          id: string
          is_24x7: boolean | null
          is_active: boolean | null
          is_online: boolean | null
          location_url: string | null
          login_enabled: boolean | null
          name: string
          owner_contact_number: string | null
          owner_email: string | null
          owner_name: string | null
          owner_whatsapp: string | null
          password: string | null
          pincode: string
          price_list_file_path: string | null
          primary_contact_name: string
          primary_contact_number: string
          primary_email: string
          remark: string | null
          repair_on_site: boolean | null
          state: string
          status: string | null
          time_end: string | null
          time_start: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          address: string
          available_days?: string[] | null
          city: string
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          is_24x7?: boolean | null
          is_active?: boolean | null
          is_online?: boolean | null
          location_url?: string | null
          login_enabled?: boolean | null
          name: string
          owner_contact_number?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_whatsapp?: string | null
          password?: string | null
          pincode: string
          price_list_file_path?: string | null
          primary_contact_name: string
          primary_contact_number: string
          primary_email: string
          remark?: string | null
          repair_on_site?: boolean | null
          state: string
          status?: string | null
          time_end?: string | null
          time_start?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          address?: string
          available_days?: string[] | null
          city?: string
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          is_24x7?: boolean | null
          is_active?: boolean | null
          is_online?: boolean | null
          location_url?: string | null
          login_enabled?: boolean | null
          name?: string
          owner_contact_number?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_whatsapp?: string | null
          password?: string | null
          pincode?: string
          price_list_file_path?: string | null
          primary_contact_name?: string
          primary_contact_number?: string
          primary_email?: string
          remark?: string | null
          repair_on_site?: boolean | null
          state?: string
          status?: string | null
          time_end?: string | null
          time_start?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_config: {
        Row: {
          average_vehicles_sold_monthly: number
          created_at: string | null
          credit_wallet_amount: number
          dealership_share: number
          id: string
          minimum_wallet_amount: number
          rsa_percentage_sold: number
          sda_share: number
          updated_at: string | null
          wallet_id: string | null
        }
        Insert: {
          average_vehicles_sold_monthly: number
          created_at?: string | null
          credit_wallet_amount: number
          dealership_share: number
          id?: string
          minimum_wallet_amount: number
          rsa_percentage_sold: number
          sda_share: number
          updated_at?: string | null
          wallet_id?: string | null
        }
        Update: {
          average_vehicles_sold_monthly?: number
          created_at?: string | null
          credit_wallet_amount?: number
          dealership_share?: number
          id?: string
          minimum_wallet_amount?: number
          rsa_percentage_sold?: number
          sda_share?: number
          updated_at?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_configurations_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_config_default: {
        Row: {
          cashback_percent: number | null
          created_at: string | null
          credit_validity_days: number | null
          id: string
          tds_percent: number | null
        }
        Insert: {
          cashback_percent?: number | null
          created_at?: string | null
          credit_validity_days?: number | null
          id?: string
          tds_percent?: number | null
        }
        Update: {
          cashback_percent?: number | null
          created_at?: string | null
          credit_validity_days?: number | null
          id?: string
          tds_percent?: number | null
        }
        Relationships: []
      }
      wallet_manual_payment_requests: {
        Row: {
          amount: number
          created_at: string | null
          dealer_id: string | null
          id: string
          receipt_url: string | null
          remarks: string | null
          status: string | null
          utr_number: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          receipt_url?: string | null
          remarks?: string | null
          status?: string | null
          utr_number?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          receipt_url?: string | null
          remarks?: string | null
          status?: string | null
          utr_number?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_manual_payment_requests_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_manual_payment_requests_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_payments: {
        Row: {
          confirmed_at: string | null
          created_at: string | null
          dealer_id: string | null
          discount: number | null
          gross_amount: number | null
          id: string
          net_amount: number | null
          payment_mode: string | null
          payment_status: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          receipt_url: string | null
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string | null
          dealer_id?: string | null
          discount?: number | null
          gross_amount?: number | null
          id?: string
          net_amount?: number | null
          payment_mode?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          receipt_url?: string | null
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string | null
          dealer_id?: string | null
          discount?: number | null
          gross_amount?: number | null
          id?: string
          net_amount?: number | null
          payment_mode?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          receipt_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_payments_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          dealer_id: string | null
          id: string
          note: string | null
          reference_id: string | null
          reference_type: string | null
          source: string | null
          type: string | null
          wallet_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          note?: string | null
          reference_id?: string | null
          reference_type?: string | null
          source?: string | null
          type?: string | null
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          note?: string | null
          reference_id?: string | null
          reference_type?: string | null
          source?: string | null
          type?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_withdrawal_options: {
        Row: {
          account_holder_name: string | null
          account_number: string | null
          created_at: string | null
          dealer_id: string | null
          id: string
          ifsc_code: string | null
          is_default: boolean | null
          razorpayx_fund_account_id: string | null
        }
        Insert: {
          account_holder_name?: string | null
          account_number?: string | null
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          ifsc_code?: string | null
          is_default?: boolean | null
          razorpayx_fund_account_id?: string | null
        }
        Update: {
          account_holder_name?: string | null
          account_number?: string | null
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          ifsc_code?: string | null
          is_default?: boolean | null
          razorpayx_fund_account_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_withdrawal_options_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_withdrawals: {
        Row: {
          amount: number
          bank_account_id: string | null
          created_at: string | null
          dealer_id: string | null
          failure_reason: string | null
          id: string
          payout_method: string | null
          payout_reference: string | null
          razorpayx_mode: string | null
          razorpayx_payout_id: string | null
          razorpayx_status: string | null
          status: string | null
          updated_at: string | null
          utr_number: string | null
        }
        Insert: {
          amount: number
          bank_account_id?: string | null
          created_at?: string | null
          dealer_id?: string | null
          failure_reason?: string | null
          id?: string
          payout_method?: string | null
          payout_reference?: string | null
          razorpayx_mode?: string | null
          razorpayx_payout_id?: string | null
          razorpayx_status?: string | null
          status?: string | null
          updated_at?: string | null
          utr_number?: string | null
        }
        Update: {
          amount?: number
          bank_account_id?: string | null
          created_at?: string | null
          dealer_id?: string | null
          failure_reason?: string | null
          id?: string
          payout_method?: string | null
          payout_reference?: string | null
          razorpayx_mode?: string | null
          razorpayx_payout_id?: string | null
          razorpayx_status?: string | null
          status?: string | null
          updated_at?: string | null
          utr_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_withdrawals_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "wallet_withdrawal_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_withdrawals_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          cash_balance: number | null
          created_at: string | null
          credit_expiry_date: string | null
          credits_limit: number | null
          credits_used: number | null
          dealer_id: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          wallet_id: string | null
        }
        Insert: {
          cash_balance?: number | null
          created_at?: string | null
          credit_expiry_date?: string | null
          credits_limit?: number | null
          credits_used?: number | null
          dealer_id?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          wallet_id?: string | null
        }
        Update: {
          cash_balance?: number | null
          created_at?: string | null
          credit_expiry_date?: string | null
          credits_limit?: number | null
          credits_used?: number | null
          dealer_id?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { oldname: string; newname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { tbl: unknown; col: string }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: { tbl: unknown; att_name: string; geom: unknown; mode?: string }
        Returns: number
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: { "": unknown }
        Returns: number
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: { "": unknown }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: { geom: unknown }
        Returns: number
      }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          g1: unknown
          clip?: unknown
          tolerance?: number
          return_polygons?: boolean
        }
        Returns: unknown
      }
      _st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      addauth: {
        Args: { "": string }
        Returns: boolean
      }
      addgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
              new_srid_in: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
          | {
              schema_name: string
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
          | {
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
        Returns: string
      }
      box: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box3d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3dtobox: {
        Args: { "": unknown }
        Returns: unknown
      }
      bytea: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dropgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
            }
          | { schema_name: string; table_name: string; column_name: string }
          | { table_name: string; column_name: string }
        Returns: string
      }
      dropgeometrytable: {
        Args:
          | { catalog_name: string; schema_name: string; table_name: string }
          | { schema_name: string; table_name: string }
          | { table_name: string }
        Returns: string
      }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      find_nearby_vendors: {
        Args: { lat: number; lng: number; radius_m: number }
        Returns: {
          vendor_id: string
          name: string
          city: string
          state: string
          distance_meters: number
        }[]
      }
      geography: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      geography_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_send: {
        Args: { "": unknown }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geography_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry: {
        Args:
          | { "": string }
          | { "": string }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
        Returns: unknown
      }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_hash: {
        Args: { "": unknown }
        Returns: number
      }
      geometry_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_send: {
        Args: { "": unknown }
        Returns: string
      }
      geometry_sortsupport: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geometry_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometrytype: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      get_employee_sales_chart: {
        Args: {
          input_employee_id: string
          range_type: string
          input_month?: number
          input_year?: number
        }
        Returns: {
          day: string
          count: number
        }[]
      }
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
      get_proj4_from_srid: {
        Args: { "": number }
        Returns: string
      }
      get_sales_chart: {
        Args: {
          input_dealer_id: string
          range_type: string
          input_month?: number
          input_year?: number
        }
        Returns: {
          day: string
          count: number
        }[]
      }
      get_top_employees_by_dealer: {
        Args: { dealer_id: string }
        Returns: Database["public"]["CompositeTypes"]["top_dealer_employee"][]
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gidx_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      json: {
        Args: { "": unknown }
        Returns: Json
      }
      jsonb: {
        Args: { "": unknown }
        Returns: Json
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      path: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      point: {
        Args: { "": unknown }
        Returns: unknown
      }
      polygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      populate_geometry_columns: {
        Args:
          | { tbl_oid: unknown; use_typmod?: boolean }
          | { use_typmod?: boolean }
        Returns: string
      }
      postgis_addbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: string
      }
      postgis_dropbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: { "": unknown }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          geomname: string
          coord_dimension: number
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_type: {
        Args: { "": number }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      spheroid_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      spheroid_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlength: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dperimeter: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle: {
        Args:
          | { line1: unknown; line2: unknown }
          | { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
        Returns: number
      }
      st_area: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_area2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_asbinary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_asewkt: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asgeojson: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; options?: number }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              r: Record<string, unknown>
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
            }
        Returns: string
      }
      st_asgml: {
        Args:
          | { "": string }
          | {
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              version: number
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
          | {
              version: number
              geom: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
        Returns: string
      }
      st_ashexewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_askml: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
        Returns: string
      }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: {
        Args: { geom: unknown; format?: string }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          geom: unknown
          bounds: unknown
          extent?: number
          buffer?: number
          clip_geom?: boolean
        }
        Returns: unknown
      }
      st_assvg: {
        Args:
          | { "": string }
          | { geog: unknown; rel?: number; maxdecimaldigits?: number }
          | { geom: unknown; rel?: number; maxdecimaldigits?: number }
        Returns: string
      }
      st_astext: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_astwkb: {
        Args:
          | {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
          | {
              geom: unknown
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
        Returns: string
      }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_boundary: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: { geom: unknown; fits?: boolean }
        Returns: unknown
      }
      st_buffer: {
        Args:
          | { geom: unknown; radius: number; options?: string }
          | { geom: unknown; radius: number; quadsegs: number }
        Returns: unknown
      }
      st_buildarea: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_centroid: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      st_cleangeometry: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: { geom: unknown; box: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: { "": unknown[] }
        Returns: unknown[]
      }
      st_collect: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collectionextract: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_geom: unknown
          param_pctconvex: number
          param_allow_holes?: boolean
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_convexhull: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_coorddim: {
        Args: { geometry: unknown }
        Returns: number
      }
      st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_curvetoline: {
        Args: { geom: unknown; tol?: number; toltype?: number; flags?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { g1: unknown; tolerance?: number; flags?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_dimension: {
        Args: { "": unknown }
        Returns: number
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance: {
        Args:
          | { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_distancesphere: {
        Args:
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; radius: number }
        Returns: number
      }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dump: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_envelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_expand: {
        Args:
          | { box: unknown; dx: number; dy: number }
          | { box: unknown; dx: number; dy: number; dz?: number }
          | { geom: unknown; dx: number; dy: number; dz?: number; dm?: number }
        Returns: unknown
      }
      st_exteriorring: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force3d: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; zvalue?: number; mvalue?: number }
        Returns: unknown
      }
      st_forcecollection: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcecurve: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcerhr: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcesfs: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_generatepoints: {
        Args:
          | { area: unknown; npoints: number }
          | { area: unknown; npoints: number; seed: number }
        Returns: unknown
      }
      st_geogfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geohash: {
        Args:
          | { geog: unknown; maxchars?: number }
          | { geom: unknown; maxchars?: number }
        Returns: string
      }
      st_geomcollfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          g: unknown
          tolerance?: number
          max_iter?: number
          fail_if_not_converged?: boolean
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometrytype: {
        Args: { "": unknown }
        Returns: string
      }
      st_geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromgeojson: {
        Args: { "": Json } | { "": Json } | { "": string }
        Returns: unknown
      }
      st_geomfromgml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: { marc21xml: string }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_gmltosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_hasarc: {
        Args: { geometry: unknown }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { size: number; cell_i: number; cell_j: number; origin?: unknown }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { size: number; bounds: unknown }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_isclosed: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_iscollection: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isempty: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isring: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_issimple: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvalid: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: { geom: unknown; flags?: number }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: { "": unknown }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_length: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_length2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_letters: {
        Args: { letters: string; font?: Json }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { txtin: string; nprecision?: number }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linemerge: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linetocurve: {
        Args: { geometry: unknown }
        Returns: unknown
      }
      st_locatealong: {
        Args: { geometry: unknown; measure: number; leftrightoffset?: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          geometry: unknown
          frommeasure: number
          tomeasure: number
          leftrightoffset?: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { geometry: unknown; fromelevation: number; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_m: {
        Args: { "": unknown }
        Returns: number
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makepolygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { "": unknown } | { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multi: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_ndims: {
        Args: { "": unknown }
        Returns: number
      }
      st_node: {
        Args: { g: unknown }
        Returns: unknown
      }
      st_normalize: {
        Args: { geom: unknown }
        Returns: unknown
      }
      st_npoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_nrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numgeometries: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorring: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpatches: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_offsetcurve: {
        Args: { line: unknown; distance: number; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_perimeter2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_pointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_points: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonize: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      st_project: {
        Args: { geog: unknown; distance: number; azimuth: number }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_x: number
          prec_y?: number
          prec_z?: number
          prec_m?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_reverse: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid: {
        Args: { geog: unknown; srid: number } | { geom: unknown; srid: number }
        Returns: unknown
      }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; vertex_fraction: number; is_outer?: boolean }
        Returns: unknown
      }
      st_split: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_square: {
        Args: { size: number; cell_i: number; cell_j: number; origin?: unknown }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { size: number; bounds: unknown }
        Returns: Record<string, unknown>[]
      }
      st_srid: {
        Args: { geog: unknown } | { geom: unknown }
        Returns: number
      }
      st_startpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_subdivide: {
        Args: { geom: unknown; maxvertices?: number; gridsize?: number }
        Returns: unknown[]
      }
      st_summary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          zoom: number
          x: number
          y: number
          bounds?: unknown
          margin?: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_transform: {
        Args:
          | { geom: unknown; from_proj: string; to_proj: string }
          | { geom: unknown; from_proj: string; to_srid: number }
          | { geom: unknown; to_proj: string }
        Returns: unknown
      }
      st_triangulatepolygon: {
        Args: { g1: unknown }
        Returns: unknown
      }
      st_union: {
        Args:
          | { "": unknown[] }
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; gridsize: number }
        Returns: unknown
      }
      st_voronoilines: {
        Args: { g1: unknown; tolerance?: number; extend_to?: unknown }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { g1: unknown; tolerance?: number; extend_to?: unknown }
        Returns: unknown
      }
      st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: { wkb: string }
        Returns: unknown
      }
      st_wkttosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_wrapx: {
        Args: { geom: unknown; wrap: number; move: number }
        Returns: unknown
      }
      st_x: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmin: {
        Args: { "": unknown }
        Returns: number
      }
      st_y: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymax: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymin: {
        Args: { "": unknown }
        Returns: number
      }
      st_z: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmflag: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmin: {
        Args: { "": unknown }
        Returns: number
      }
      text: {
        Args: { "": unknown }
        Returns: string
      }
      unlockrows: {
        Args: { "": string }
        Returns: number
      }
      update_wallet_balance_after_recharge: {
        Args: { dealer_id_input: string; addition_amount: number }
        Returns: undefined
      }
      update_wallet_balance_after_withdrawal: {
        Args: { dealer_id_input: string; deduction_amount: number }
        Returns: undefined
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          schema_name: string
          table_name: string
          column_name: string
          new_srid_in: number
        }
        Returns: string
      }
    }
    Enums: {
      employment_type_enum: "full_time" | "part_time" | "contractor"
      gender_enum: "male" | "female" | "other"
      status_enum: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      top_dealer_employee: {
        name: string | null
        total_customers: number | null
        total_revenue: number | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
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
