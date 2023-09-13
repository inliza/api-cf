import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const morgan = require("morgan");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan("tiny"));
  app.enableCors();

  const configService = app.get(ConfigService);

  const port = configService.get('PORT') || 3003;
  await app.listen(port, () => console.info(`Listening on port ${port}`));
}

bootstrap();
