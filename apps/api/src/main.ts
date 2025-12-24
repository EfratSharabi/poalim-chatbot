import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Serve Angular SPA
  const publicPath = join(__dirname, 'public');
  app.useStaticAssets(publicPath);
  app.setBaseViewsDir(publicPath);

  // Use Express types for req/res
  app.getHttpAdapter().get('/:path(.*)', (req: Request, res: Response) => {
    res.sendFile(join(publicPath, 'index.html'));
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 Application is running on: http://0.0.0.0:${port}/${globalPrefix}`);
}

bootstrap();
