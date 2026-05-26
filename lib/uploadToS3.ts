/**
 * Upload a file to S3 using a presigned URL
 * @param file - The file to upload
 * @param uploadUrl - The presigned URL from the backend
 * @returns Promise that resolves when upload is complete
 */
export async function uploadToS3(file: File, uploadUrl: string): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
}

/**
 * Complete workflow for uploading a product image
 * 1. Get signed URL from backend
 * 2. Upload file to S3
 * 3. Return the final URL to store in database
 */
export async function uploadProductImage(
  file: File,
  generateUploadUrl: (data: { fileName: string; contentType: string }) => Promise<any>
): Promise<string> {
  // Step 1: Get signed URL
  const { uploadUrl, finalUrl } = await generateUploadUrl({
    fileName: file.name,
    contentType: file.type,
  });

  // Step 2: Upload to S3
  await uploadToS3(file, uploadUrl);

  // Step 3: Return final URL
  return finalUrl;
}
