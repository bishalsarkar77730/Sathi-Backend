import fs from 'fs';
import multer from 'multer';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';

export const fileToBase64 = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data.toString('base64'));
    });
  });
};

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (
    file.mimetype.startsWith('image/') ||
    allowedMimeTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type! Only images, PDFs, and Word docs are allowed.',
      ),
    );
  }
};

export const uploadMemory = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});
