import { db } from "../config/db"

export const getBusinessHeadId = async (): Promise<string> => {
  // const { data, error } = await db
  //   .from('employees')
  //   .select('id')
  //   .eq('employee_id', '129533') // ✅ or filter based on role = 'business_head'
  //   .limit(1)
  //   .single();

  // if (error || !data) {
  //   throw new Error('Business Head not found');
  // }

  return "f3be3c6a-99a6-43e4-b48e-011b3f44d054"
}
