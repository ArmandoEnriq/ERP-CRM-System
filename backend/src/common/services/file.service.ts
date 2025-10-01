import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Guardar archivo en el sistema de archivos local
   */
  async saveFile(
    file: Express.Multer.File,
    directory: string,
  ): Promise<string> {
    try {
      const uploadPath = path.join(process.cwd(), 'uploads', directory);

      // Crear directorio si no existe
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // Generar nombre único
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
      const filePath = path.join(uploadPath, fileName);

      // Guardar archivo
      fs.writeFileSync(filePath, file.buffer);

      this.logger.log(`File saved: ${fileName}`);

      return `uploads/${directory}/${fileName}`;
    } catch (error) {
      this.logger.error(`Error saving file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Eliminar archivo del sistema
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      const fullPath = path.join(process.cwd(), filePath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        this.logger.log(`File deleted: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
    }
  }

  /**
   * Validar tipo de archivo
   */
  validateFileType(file: Express.Multer.File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.mimetype);
  }

  /**
   * Validar tamaño de archivo
   */
  validateFileSize(file: Express.Multer.File, maxSizeInBytes: number): boolean {
    return file.size <= maxSizeInBytes;
  }
}
