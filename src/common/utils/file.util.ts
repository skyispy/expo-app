import * as fs from 'fs';
import * as path from 'path';

export const saveFileToDist = (file: Express.Multer.File, subDir: string): string => {
  const distDir = path.join(__dirname, '../../../uploads', subDir);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  const filePath = path.join(distDir, file.originalname);
  fs.writeFileSync(filePath, file.buffer);

  // 저장된 파일 경로 반환 (예: uploads/profile-images/filename.jpg)
  const uploadsDir = path.join(__dirname, '../../../uploads');
  const relativePath = path.relative(uploadsDir, filePath);
  return path.join('uploads', relativePath);
};
