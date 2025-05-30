import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:4200', // For local dev
      'https://chat-app-frontend.vercel.app', // Your Vercel production domain
      'https://chat-app-frontend-7nux4otjl-rashidraxis-projects.vercel.app', // Preview URL
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
