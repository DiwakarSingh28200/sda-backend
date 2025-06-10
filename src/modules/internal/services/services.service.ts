import { db } from "../../../config/db"
import { generateEmployeeId } from "../../../utils/index"
import { createNotification } from "../notification/notification.service"
import bcrypt from "bcrypt"

export const createApprovalInstance = async ({
  approval_type_id,
  reference_id,
  requested_by,
  metadata,
}: {
  approval_type_id: string
  reference_id: string
  requested_by: string
  metadata?: Record<string, any>
}) => {
  // Step 1: Get approval flow steps
  const { data: flowSteps, error: flowError } = await db
    .from("approval_flows")
    .select("*")
    .eq("approval_type_id", approval_type_id)
    .order("step_number", { ascending: true })

  if (flowError || !flowSteps || flowSteps.length === 0) {
    throw new Error("Approval flow not defined for this type.")
  }
  // Step 2: Create instance
  const { data: instance, error: instanceError } = await db
    .from("approval_instances")
    .insert({
      approval_type_id,
      reference_id,
      requested_by,
      current_step: 1,
      status: "pending",
      metadata,
    })
    .select()
    .single()

  if (instanceError) {
    throw new Error("Failed to create approval instance.")
  }

  // Step 3: Resolve assignee for first step
  const firstStep = flowSteps[0]

  const { data: role } = await db
    .from("roles")
    .select("id")
    .eq("role", firstStep.role_required)
    .single()

  if (!role) throw new Error(`Role ${firstStep.role_required} not found.`)

  const { data: assignee } = await db
    .from("employee_roles")
    .select("employee_id")
    .eq("role_id", role.id)
    .limit(1)
    .single()

  if (!assignee) throw new Error(`No employee assigned to role ${firstStep.role_required}.`)

  // Step 4: Create step 1
  const { error: stepError } = await db.from("approval_steps").insert({
    instance_id: instance.id,
    step_number: 1,
    role: firstStep.role_required,
    assigned_to: assignee.employee_id,
    status: "pending",
  })

  if (stepError) throw new Error("Failed to create initial step.")

  return instance
}

export const approveStep = async ({
  instance_id,
  performed_by,
  comment,
}: {
  instance_id: string
  performed_by: string
  comment?: string
}) => {
  try {
    // 1. Fetch current step
    const { data: currentStep } = await db
      .from("approval_steps")
      .select("*")
      .eq("instance_id", instance_id)
      .eq("status", "pending")
      .order("step_number", { ascending: true })
      .limit(1)
      .single()

    if (!currentStep) throw new Error("No pending approval step found.")

    // 2. Update current step to approved
    await db
      .from("approval_steps")
      .update({
        status: "approved",
        comment: comment || "",
        performed_by,
        performed_at: new Date().toISOString(),
      })
      .eq("id", currentStep.id)

    // 3. Get instance
    const { data: instance } = await db
      .from("approval_instances")
      .select("*")
      .eq("id", instance_id)
      .single()

    if (!instance) throw new Error("Approval instance not found.")

    // 4. Get all flow steps
    const { data: flowSteps } = await db
      .from("approval_flows")
      .select("*")
      .eq("approval_type_id", instance.approval_type_id!)
      .order("step_number", { ascending: true })

    if (!flowSteps) throw new Error("Approval flow steps not found.")

    const currentIndex = flowSteps.findIndex((s) => s.step_number === currentStep.step_number)
    const nextStep = flowSteps[currentIndex + 1]

    if (!nextStep) {
      // ✅ Final step
      await db
        .from("approval_instances")
        .update({
          status: "approved",
          current_step: currentStep.step_number,
        })
        .eq("id", instance_id)

      // TODO: Notify requester — approved ✅

      // ✅ Check if this is employee onboarding
      const { data: type } = await db
        .from("approval_types")
        .select("name")
        .eq("id", instance.approval_type_id!)
        .single()

      if (type?.name === "employee_onboarding") {
        // 1. Generate new 6-digit employee ID
        const newEmployeeId = generateEmployeeId()

        // 2. Generate hashed password
        const tempPassword = "Welcome@1234"
        const hashedPassword = await bcrypt.hash(tempPassword, 10)

        // 3. Update employee record
        await db
          .from("employees")
          .update({
            employee_id: newEmployeeId,
            password: hashedPassword,
            status: "approved",
          })
          .eq("id", instance.reference_id)

        const { data: employee } = await db
          .from("employees")
          .select("first_name, last_name, department:department_id(name), role:role_id(role_name)")
          .eq("id", instance.reference_id)
          .single()

        // 4. Add to audit logs
        await db.from("audit_logs").insert({
          entity_type: "employee",
          reference_id: instance.reference_id,
          action: "approved",
          performed_by,
          remarks: `Employee ${employee?.first_name} ${employee?.last_name} as ${employee?.role?.role_name} in ${employee?.department?.name} department onboarding approved by Business Head. `,
        })

        await createNotification({
          recipient_id: instance.requested_by!,
          sender_id: performed_by,
          type: "approval",
          message: `Employee ${employee?.first_name} ${employee?.last_name} onboarding approved by Business Head. `,
          reference_id: instance_id,
          metadata: {
            status: "approved",
            ...((instance.metadata as object) || {}),
          },
        })

        // (Optional) ✅ Send Email/Notification with credentials

        return { message: "Approval completed." }
      }
    }

    await db.from("audit_logs").insert({
      entity_type: "approval",
      reference_id: instance_id,
      action: "approved",
      performed_by,
      remarks: comment
        ? comment
        : `Finance Head approved the finance related details of ${
            //@ts-ignore
            instance.metadata?.employee_name!
          }.`,
    })

    // 5. Resolve next approver
    const { data: role } = await db
      .from("roles")
      .select("id")
      .eq("role", nextStep.role_required)
      .single()

    if (!role) throw new Error(`Role ${nextStep.role_required} not found.`)

    const { data: nextAssignee } = await db
      .from("employee_roles")
      .select("employee_id")
      .eq("role_id", role.id)
      .limit(1)
      .single()

    if (!nextAssignee) throw new Error(`No employee assigned to next step.`)

    // 6. Create next step
    await db.from("approval_steps").insert({
      instance_id,
      step_number: nextStep.step_number,
      role: nextStep.role_required,
      assigned_to: nextAssignee.employee_id,
      status: "pending",
    })

    await createNotification({
      recipient_id: nextAssignee.employee_id!,
      sender_id: performed_by,
      type: "approval",
      message: `New approval request assigned to you.`,
      reference_id: instance_id,
      metadata: {
        step: nextStep.step_number,
        approval_type: instance.approval_type_id,
        reference_id: instance.reference_id,
      },
    })

    // 7. Update instance
    await db
      .from("approval_instances")
      .update({
        current_step: nextStep.step_number,
      })
      .eq("id", instance_id)

    // TODO: Notify next approver

    return { message: "Step approved and next step initiated." }
  } catch (error) {
    console.log(error)
    return { message: "Failed to approve step." }
  }
}

export const rejectStep = async ({
  instance_id,
  performed_by,
  comment,
}: {
  instance_id: string
  performed_by: string
  comment?: string
}) => {
  // 1. Get current step
  const { data: currentStep } = await db
    .from("approval_steps")
    .select("*")
    .eq("instance_id", instance_id)
    .eq("status", "pending")
    .order("step_number", { ascending: true })
    .limit(1)
    .single()

  if (!currentStep) throw new Error("No pending approval step found.")

  // 2. Mark step as rejected
  await db
    .from("approval_steps")
    .update({
      status: "rejected",
      comment: comment || "",
      performed_by,
      performed_at: new Date().toISOString(),
    })
    .eq("id", currentStep.id)

  await db.from("audit_logs").insert({
    entity_type: "approval",
    reference_id: instance_id,
    action: "rejected",
    performed_by,
    remarks: `Step ${currentStep.step_number} rejected by ${currentStep.role}. ${comment ?? ""}`,
  })

  // 3. Update instance status
  await db
    .from("approval_instances")
    .update({
      status: "correction_needed",
    })
    .eq("id", instance_id)

  // 4. Get instance details
  const { data: instance } = await db
    .from("approval_instances")
    .select("requested_by, metadata")
    .eq("id", instance_id)
    .single()

  // 5. Notify requester (e.g. HR)
  if (instance?.requested_by) {
    await createNotification({
      recipient_id: instance.requested_by,
      sender_id: performed_by,
      type: "approval",
      message: `Approval rejected. ${comment || ""}`,
      reference_id: instance_id,
      metadata: {
        status: "correction_needed",
        ...((instance.metadata as object) || {}),
      },
    })
  }

  return { message: "Step rejected. Awaiting correction." }
}

export const resubmitStep = async ({
  instance_id,
  performed_by,
  correction_comment,
}: {
  instance_id: string
  performed_by: string
  correction_comment?: string
}) => {
  // 1. Get approval instance
  const { data: instance } = await db
    .from("approval_instances")
    .select("*")
    .eq("id", instance_id)
    .single()

  if (!instance) throw new Error("Approval instance not found.")

  if (instance.status !== "correction_needed") {
    throw new Error("Only approvals marked for correction can be resubmitted.")
  }

  // 2. Find rejected step
  const { data: rejectedStep } = await db
    .from("approval_steps")
    .select("*")
    .eq("instance_id", instance_id)
    .eq("status", "rejected")
    .order("step_number", { ascending: false })
    .limit(1)
    .single()

  if (!rejectedStep) {
    throw new Error("Rejected step not found.")
  }

  // 3. Mark all previous steps as archived
  await db
    .from("approval_steps")
    .update({ status: "archived" })
    .eq("instance_id", instance_id)
    .in("status", ["approved", "rejected", "pending"])

  // 4. Create fresh step for the same number & role
  const { data: role } = await db
    .from("roles")
    .select("id")
    .eq("role", rejectedStep.role!)
    .single()

  const { data: assignee } = await db
    .from("employee_roles")
    .select("employee_id")
    .eq("role_id", role?.id!)
    .limit(1)
    .single()

  if (!assignee) throw new Error("No assignee found for the resubmitted step.")

  await db.from("approval_steps").insert({
    instance_id,
    step_number: rejectedStep.step_number,
    role: rejectedStep.role,
    assigned_to: assignee.employee_id,
    status: "pending",
  })

  // 5. Update instance
  await db
    .from("approval_instances")
    .update({
      status: "pending",
      current_step: rejectedStep.step_number,
    })
    .eq("id", instance_id)

  // 6. Notify assignee
  await createNotification({
    recipient_id: assignee.employee_id!,
    sender_id: performed_by,
    type: "approval",
    message: `Resubmitted approval request. Please review again.`,
    reference_id: instance_id,
    metadata: {
      resubmitted: true,
      step: rejectedStep.step_number,
    },
  })

  // 7. (Optional) Audit log
  await db.from("audit_logs").insert({
    entity_type: "approval",
    reference_id: instance_id,
    action: "resubmitted",
    performed_by,
    remarks: correction_comment || "Request resubmitted with corrections.",
  })

  return { message: "Approval request resubmitted successfully." }
}
