import { Controller, Get, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { GoogleDriveService } from './google-drive.service';

@Controller('image-proxy')
export class ImageProxyController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Get()
  async getImage(@Query('fileId') fileId: string, @Res() res: Response) {
    if (!fileId) {
      throw new HttpException('fileId is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const imageBuffer = await this.googleDriveService.downloadFile(fileId);
      
      // Configurar headers para la imagen
      res.setHeader('Content-Type', 'image/jpeg'); // Ajusta según el tipo de imagen
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache de 1 día
      res.send(imageBuffer);
    } catch (error) {
      throw new HttpException('Error al obtener imagen de Drive', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
