import { db } from "../config/db" // your Supabase client

export const uploadFileToStorage = async (
  file: File,
  path: string,
  bucketName = "dealers"
): Promise<string> => {
  const buffer = Buffer.from(await file.arrayBuffer()) // Convert file to buffer

  const { error } = await db.storage.from(bucketName).upload(path, buffer, {
    upsert: true,
    contentType: file.type,
  })

  if (error) {
    throw new Error(`File upload failed: ${error.message}`)
  }

  // Construct public URL
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "" // Or your Supabase URL
  return `${baseUrl}/storage/v1/object/public/${bucketName}/${path}`
}
