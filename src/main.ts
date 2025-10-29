import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
