// $$$$$$$\  $$\       $$$$$$\  $$$$$$\   $$$$$$\  
// $$  __$$\ $$ |      \_$$  _|$$  __$$\ $$  __$$\ 
// $$ |  $$ |$$ |        $$ |  $$ /  \__|$$ /  \__|
// $$$$$$$\ |$$ |        $$ |  \$$$$$$\  \$$$$$$\  
// $$  __$$\ $$ |        $$ |   \____$$\  \____$$\ 
// $$ |  $$ |$$ |        $$ |  $$\   $$ |$$\   $$ |
// $$$$$$$  |$$$$$$$$\ $$$$$$\ \$$$$$$  |\$$$$$$  |
// \_______/ \________|\______| \______/  \______/ 
                                                
                                                
                                                


import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';

import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(morgan('dev'));

  // Serve uploaded files statically
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // enable global validation for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // cors
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix('/api/v1');

  await app.listen(process.env.PORT ?? 4005, '0.0.0.0');
  console.log(`🚀 Server is running on port ${process.env.PORT}`);
}
bootstrap();

// main.ts
