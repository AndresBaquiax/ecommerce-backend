import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class LocalStorageService {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads', 'images');

  constructor() {
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Guarda una imagen localmente
   * @param buffer - El contenido del archivo
   * @param originalName - El nombre original del archivo
   * @returns La ruta relativa del archivo guardado
   */
  async uploadFile(buffer: Buffer, originalName: string): Promise<string> {
    try {
      // Generar un nombre único para el archivo
      const ext = path.extname(originalName);
      const nameWithoutExt = path.basename(originalName, ext);
      const uniqueName = `${nameWithoutExt}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
      
      // Ruta completa del archivo
      const filePath = path.join(this.uploadsDir, uniqueName);
      
      // Guardar el archivo
      fs.writeFileSync(filePath, buffer);
      
      // Retornar ruta relativa para usar en la URL
      return `/uploads/images/${uniqueName}`;
    } catch (error) {
      throw new Error(`Error al guardar imagen localmente: ${error.message}`);
    }
  }

  /**
   * Obtiene una imagen del almacenamiento local
   * @param imagePath - La ruta relativa de la imagen
   * @returns El contenido del archivo como Buffer
   */
  async getFile(imagePath: string): Promise<Buffer> {
    try {
      // Sanitizar la ruta para evitar directory traversal
      const sanitizedPath = path.basename(imagePath);
      const filePath = path.join(this.uploadsDir, sanitizedPath);
      
      if (!fs.existsSync(filePath)) {
        throw new Error('Archivo no encontrado');
      }
      
      return fs.readFileSync(filePath);
    } catch (error) {
      throw new Error(`Error al obtener imagen: ${error.message}`);
    }
  }

  /**
   * Elimina una imagen del almacenamiento local
   * @param imagePath - La ruta relativa de la imagen
   */
  async deleteFile(imagePath: string): Promise<void> {
    try {
      // Sanitizar la ruta para evitar directory traversal
      const sanitizedPath = path.basename(imagePath);
      const filePath = path.join(this.uploadsDir, sanitizedPath);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      throw new Error(`Error al eliminar imagen: ${error.message}`);
    }
  }

  /**
   * Verifica si un archivo existe
   * @param imagePath - La ruta relativa de la imagen
   */
  async fileExists(imagePath: string): Promise<boolean> {
    try {
      const sanitizedPath = path.basename(imagePath);
      const filePath = path.join(this.uploadsDir, sanitizedPath);
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }
}
