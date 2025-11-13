import { Injectable } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GoogleDriveService {
  private drive: drive_v3.Drive;
  private oauth2Client: any;

  constructor() {
    // Configurar OAuth2 client
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_DRIVE_CLIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      process.env.GOOGLE_DRIVE_REDIRECT_URI
    );

    // Cargar tokens desde variable de entorno o archivo local
    let tokens;
    if (process.env.GOOGLE_DRIVE_TOKENS) {
      // En producción (Render), usar variable de entorno
      tokens = JSON.parse(process.env.GOOGLE_DRIVE_TOKENS);
    } else {
      // En desarrollo, usar archivo local
      const tokenPath = path.join(process.cwd(), 'tokens.json');
      if (fs.existsSync(tokenPath)) {
        tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
      } else {
        throw new Error('No se encontró el archivo tokens.json ni la variable GOOGLE_DRIVE_TOKENS');
      }
    }
    
    this.oauth2Client.setCredentials(tokens);
    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  async uploadFile(fileName: string, mimeType: string, buffer: Buffer): Promise<string> {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const fileMetadata: any = {
      name: fileName,
    };
    if (folderId) {
      fileMetadata.parents = [folderId];
    }
    const media = {
      mimeType,
      body: Readable.from(buffer),
    };
    
    try {
      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id, webViewLink, webContentLink',
      });
      
      // Hacer el archivo público para que se pueda acceder sin autenticación
      if (response.data.id) {
        await this.drive.permissions.create({
          fileId: response.data.id,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });
      }
      
      // Retornar webViewLink (URL de vista de Google Drive)
      return response.data.webViewLink || '';
    } catch (error) {
      console.error('Error al subir archivo a Google Drive:', error);
      throw new Error('Error al subir imagen a Google Drive: ' + error.message);
    }
  }

  async downloadFile(fileId: string): Promise<Buffer> {
    try {
      const response = await this.drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'arraybuffer' }
      );
      return Buffer.from(response.data as ArrayBuffer);
    } catch (error) {
      console.error('Error al descargar archivo de Google Drive:', error);
      throw new Error('Error al descargar imagen de Google Drive: ' + error.message);
    }
  }
}
