import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:
      'https://chat-app-frontend-7nux4otjl-rashidraxis-projects.vercel.app', // Angular's dev server
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
