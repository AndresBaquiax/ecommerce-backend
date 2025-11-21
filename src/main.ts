import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir archivos estáticos (imágenes)
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Configurar CORS
  app.enableCors({
    origin: ['http://localhost:3039', 'https://ecommerce-g3-front.vercel.app', 'https://www.mitiendita-ecommerce.store'],

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('API Supermercado')
    .setDescription('Documentación del backend del supermercado')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document); // URL: http://localhost:3000/

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
