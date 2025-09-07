import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const fileName = file.originalname
        .toLocaleLowerCase()
        .replace(/[. ]/g, "_")
              .replace(/[^a-zA-Z0-9]/g, "");
          const uniqueFileName = Math.random().toString(36).substring(2) + "_" + Date.now() + fileName;
          return uniqueFileName;
    },
  },
});
export const multerUpload=multer({storage:storage})