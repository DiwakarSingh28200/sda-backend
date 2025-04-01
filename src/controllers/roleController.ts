import { Request, Response } from "express"
import { db } from "../config/db"
import { ApiResponse } from "../types/apiResponse"

// Get all roles
// export const getAllRoles = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
//   try {
//     const { data: roles, error } = await db
//       .from("roles")
//       .select(`
//     id,
//     role,
//     role_name,
//     description,
//     departments(id,name),
//     created_by:employees!roles_created_by_fkey(id, first_name, last_name)
//   `)

//     if (error || !roles) {
//       return res.status(500).json({success: false, message: "Failed to fetch roles.", error: error.details,data: roles  });
//     }

//     // Transform the data
//     const transformedRoles = roles.map((role) => ({
//       id: role.id,
//       role: role.role,
//       role_name: role.role_name,
//       description: role.description,
//       department: role.departments,
//       created_by: role.created_by,
//     }));

//     return res.json({ success: true, message: "Roles fetched successfully.", data: transformedRoles });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
//   }
// };

// Get a specific role by ID
export const getRoleById = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { id } = req.params

    const { data: role, error } = await db
      .from("roles")
      .select(
        `
        id, 
        role, 
        role_name, 
        description, 
        departments(id,name),  
        employees(id,first_name, last_name)`
      )
      .eq("id", id)
      .single()

    if (error || !role) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found.", error: error.message as string })
    }

    const filterData = {
      id: role.id,
      role: role.role,
      role_name: role.role_name,
      description: role.description,
      department: role.departments,
      created_by: role.employees,
    }

    return res.json({ success: true, message: "Role fetched successfully.", data: filterData })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error: error as string })
  }
}

// Create a new role
export const createRole = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { role, role_name, description, department_id } = req.body
    const user = req.user

    console.log("Body: ", req.body)

    if (!role || !role_name || !description || !department_id) {
      return res.status(400).json({ success: false, message: "All fields are required." })
    }

    const { error } = await db
      .from("roles")
      .insert({ role, role_name, description, department_id, created_by: user?.id! })

    if (error) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to create role.", error: error.message })
    }

    return res.json({ success: true, message: "Role created successfully." })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error: error as string })
  }
}

// Update an existing role
export const updateRole = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { id } = req.params
    const { role, role_name, description, department_id } = req.body

    if (!role || !role_name || !description || !department_id) {
      return res.status(400).json({ success: false, message: "All fields are required." })
    }

    const { error } = await db
      .from("roles")
      .update({ role, role_name, description, department_id })
      .eq("id", id)

    if (error) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update role.", error: error.message })
    }

    return res.json({ success: true, message: "Role updated successfully." })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error: error as string })
  }
}

// Delete a role
export const deleteRole = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { id } = req.params

    const { error } = await db.from("roles").delete().eq("id", id)

    if (error) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete role.", error: error.message })
    }

    return res.json({ success: true, message: "Role deleted successfully." })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error: error as string })
  }
}
// export const getRolesWithPermissions = async (
//   req: Request,
//   res: Response<ApiResponse<any>>
// ): Promise<Response> => {
//   try {
//     // const { data, error } = await db
//     //   .from("roles")
//     //   .select(`
//     //     id,
//     //     role,
//     //     role_name,
//     //     description,
//     //   `);

//     // if (error) {
//     //   return res.status(500).json({
//     //     success: false,
//     //     message: "Failed to fetch roles with permissions.",
//     //     error: error.message,
//     //   });
//     // }

//     // const transformed = data.map((role) => ({
//     //   id: role.id,
//     //   role: role.role,
//     //   role_name: role.role_name,
//     //   description: role.description,
//     //   department: role.departments, // alias for department name
//     //   permissions: role.role_permissions.map((rp) => rp.permissions),
//     // }));

//     return res.json({
//       success: true,
//       message: "Roles with permissions heelo retrieved successfully.",
//       data: [],
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error.",
//       error: error as string,
//     });
//   }
// };

export const getAllRoles = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { data: roles, error } = await db.from("roles").select(`
        id,
        role,
        role_name,
        description,
        departments(id, name),
        created_by:employees!roles_created_by_fkey(id, first_name, last_name),
        role_permissions:role_permissions(
          permissions(id, name, description, category)
        )
      `)

    if (error || !roles) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch roles.",
        error: error.details,
        data: roles,
      })
    }

    const transformedRoles = roles.map((role) => ({
      id: role.id,
      role: role.role,
      role_name: role.role_name,
      description: role.description,
      department: role.departments,
      created_by: role.created_by,
      permissions: role.role_permissions.map((rp) => rp.permissions),
    }))

    return res.json({
      success: true,
      message: "Roles fetched successfully.",
      data: transformedRoles,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error as string,
    })
  }
}
