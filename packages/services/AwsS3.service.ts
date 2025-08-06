import { S3Client } from '@aws-sdk/client-s3';
import multer, { FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
import { Request } from 'express';
import { config } from '../config/env.config';

// Create S3 client
const s3 = new S3Client({
  region: config.S3REGION,
  credentials: {
    accessKeyId: config.ACCESSKEYID,
    secretAccessKey: config.SECRETACCESSKEY,
  },
});

// File filter
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/svg+xml' ||
    file.mimetype === 'image/webp' ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type, only JPEG, PNG, SVG, WEBP, PDF, and Word files are allowed!',
      ),
    );
  }
};

// Export upload middleware
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req: Request, file: Express.Multer.File, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req: Request, file: Express.Multer.File, cb) => {
      const folder = 'images/';
      const filename = Date.now() + '_' + file.originalname;
      cb(null, folder + filename);
    },
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB
    files: 150,
  },
});
