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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
