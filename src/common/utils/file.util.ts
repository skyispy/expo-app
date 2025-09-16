import * as fs from 'fs';
import * as path from 'path';

export function saveFileToDist(file: Express.Multer.File, subDir: string): string {
  const distDir = path.join(__dirname, '../../../uploads', subDir);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  const filePath = path.join(distDir, file.originalname);
  fs.writeFileSync(filePath, file.buffer);
  return filePath;
}
