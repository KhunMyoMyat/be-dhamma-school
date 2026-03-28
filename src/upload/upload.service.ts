import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  async processImage(file: Express.Multer.File): Promise<void> {
    const filePath = file.path;
    const tempPath = filePath + '-temp';

    // Move original to temp
    fs.renameSync(filePath, tempPath);

    try {
      await sharp(tempPath)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toFile(filePath);

      // Remove temp file
      fs.unlinkSync(tempPath);
    } catch (error) {
      console.error('Error processing image with sharp:', error);
      // If sharp fails, restore original from temp
      if (fs.existsSync(tempPath)) {
        fs.renameSync(tempPath, filePath);
      }
    }
  }
}
