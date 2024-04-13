import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { GlobalExceptionFilter } from './common/exceptions/exception.filter';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { WinstonOptions } from './common/providers/winston.provider';
import { validate } from './common/validation/env.validation'; // Assuming the file is located here
import { GenreModule } from './modules/genre/genre.module';
import { MovieModule } from './modules/movie/movie.module';

@Module({
  imports: [
    // Enviroment Config
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
    // TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('POSTGRES_HOST'),
        port: configService.getOrThrow<number>('POSTGRES_PORT'),
        username: configService.getOrThrow<string>('POSTGRES_USERNAME'),
        password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
        database: configService.getOrThrow<string>('POSTGRES_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Path to entity files
        logger: 'file',
        synchronize: configService.getOrThrow<boolean>('POSTGRES_SYNCHRONIZE'), // Auto-create database tables (in development)
      }),
      inject: [ConfigService],
    }),
    // Winston Logger
    WinstonModule.forRootAsync({
      useClass: WinstonOptions,
    }),
    // Modules
    GenreModule,
    MovieModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .exclude('/')
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
