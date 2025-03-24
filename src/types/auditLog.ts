export interface AuditLog {
    id: string;
    entity_type: string;
    reference_id: string;
    action: string;
    performed_by: string;
    remarks?: string;
    created_at: string;
  }
  