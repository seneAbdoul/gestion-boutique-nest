import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig'; // Assurez-vous que le chemin est correct

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'user_gestion_dette',
    resource_type: 'auto',
  }),
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = /jpeg|jpg|png|jfif|gif|webp/;
  const mimeType = allowedMimeTypes.test(file.mimetype);
  const extname = allowedMimeTypes.test(file.originalname.split('.').pop()?.toLowerCase() || '');

  if (mimeType && extname) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
  }
};

const limits = { fileSize: 10 * 1024 * 1024 }; // 10 MB

export { storage, fileFilter, limits };
