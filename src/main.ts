import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as correlator from 'express-correlation-id';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { customValidationPipe } from './common/exceptions/validation.pipe';
import { setupSwagger } from './common/providers/swagger.provider';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Config
  const configService = app.get(ConfigService);

  // CORS
  app.enableCors();

  // Validation
  app.useGlobalPipes(customValidationPipe);

  // Logging
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Swagger
  setupSwagger(app);

  // Correlator
  app.use(correlator());

  await app.listen(configService.getOrThrow<number>('PORT'));
}
bootstrap();
