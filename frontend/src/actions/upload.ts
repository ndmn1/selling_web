"use server";

import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

export async function uploadImage(file: File, type: 'brand' | 'product' = 'brand'): Promise<string> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }

  // Generate unique filename
  const timestamp = Date.now();
  const fileExtension = path.extname(file.name);
  const fileName = `${type}_${timestamp}${fileExtension}`;
  
  // Ensure directory exists
  const uploadDir = path.join(process.cwd(), 'public', type === 'brand' ? 'brands' : 'products');
  await mkdir(uploadDir, { recursive: true });
  
  // Save file
  const filePath = path.join(uploadDir, fileName);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);

  // Return the public URL
  return `/${type === 'brand' ? 'brands' : 'products'}/${fileName}`;
}

export async function deleteImage(imageUrl: string): Promise<void> {
  if (!imageUrl || (!imageUrl.startsWith('/brands/') && !imageUrl.startsWith('/products/'))) {
    return; // Skip if no image or not a valid image path
  }

  try {
    const fileName = path.basename(imageUrl);
    const isProduct = imageUrl.startsWith('/products/');
    const uploadDir = isProduct ? 'products' : 'brands';
    const filePath = path.join(process.cwd(), 'public', uploadDir, fileName);
    await unlink(filePath);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error as file might not exist
  }
} 