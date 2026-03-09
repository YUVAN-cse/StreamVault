import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});


export const uploadAndDeleteLocal = async (localFilePath) => {
  try {
    if (localFilePath) {
      console.log("Uploading:", localFilePath);
  
      const result = await cloudinary.uploader.upload(localFilePath, {
        resource_type: 'auto' 
      });
  
      await fs.unlink(localFilePath);
  
      return result;
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    console.error('Full error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};
