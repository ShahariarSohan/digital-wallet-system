/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
import  httpStatus  from 'http-status-codes';
import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/appError";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const regex = /\/([^\/]+)\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
    const match = url.match(regex);
    
    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id)
      console.log(`File ${public_id} is deleted from Cloudinay`)

    }
  }
  catch (err:any) {
   throw new AppError(httpStatus.BAD_REQUEST,"There was an error when deleting image",err.message)
  }
}

export const cloudinaryUpload = cloudinary;
