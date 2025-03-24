import { Request, Response } from "express";
import { db } from "../config/db";
import { ApiResponse } from "../types/apiResponse";

export const getAllAuditLogs = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const { entity_type, reference_id } = req.query;

    let query = db
      .from("audit_logs")
      .select("id, entity_type, reference_id, action, remarks, created_at, performed_by(id, first_name, last_name)")
      .order("created_at", { ascending: false });

    if (entity_type) query = query.eq("entity_type", entity_type as string);
    if (reference_id) query = query.eq("reference_id", reference_id as string);

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ success: false, message: "Error fetching audit logs." });
    }

    return res.json({ success: true, message: "Audit logs retrieved successfully.", data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const getAuditLogById = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
    try {
      const { id } = req.params;
  
      const { data, error } = await db
        .from("audit_logs")
        .select("id, entity_type, reference_id, action, remarks, created_at, performed_by(id, first_name, last_name)")
        .eq("id", id)
        .single();
  
      if (error || !data) {
        return res.status(404).json({ success: false, message: "Audit log not found." });
      }
  
      return res.json({ success: true, message: "Audit log retrieved successfully.", data });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

export const createAuditLog = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
    try {
      const { entity_type, reference_id, action, remarks } = req.body;
      const performed_by = req.user?.id;
  
      if (!entity_type || !reference_id || !action || !performed_by) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
      }
  
      const { data, error } = await db
        .from("audit_logs")
        .insert([{ entity_type, reference_id, action, remarks, performed_by }])
        .select()
        .single();
  
      if (error) {
        return res.status(400).json({ success: false, message: "Error creating audit log.", error: error.message });
      }
  
      return res.json({ success: true, message: "Audit log created successfully.", data });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };
  

  export const insertAuditLog = async ({
    entity_type,
    reference_id,
    action,
    performed_by,
    remarks = null,
  }: {
    entity_type: string;
    reference_id: string;
    action: string;
    performed_by: string;
    remarks?: string | null;
  }) => {
    await db.from("audit_logs").insert([{ entity_type, reference_id, action, performed_by, remarks }]);
  };
  