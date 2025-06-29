// lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file) {
  if (!file || !file.size) {
    throw new Error('No file provided');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mime = file.type || 'image/jpeg';
  const base64 = buffer.toString('base64');
  const dataUri = `data:${mime};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'nextjs-course-mutations',
    transformation: [
      {
        width: 200,
        height: 200,
        crop: 'fill',        // crop to exact size
        gravity: 'auto',     // smart crop
        quality: 'auto',     // automatic quality optimization
        fetch_format: 'auto' // auto format like WebP if supported
      }
    ],
  });

  return result.secure_url;
}
