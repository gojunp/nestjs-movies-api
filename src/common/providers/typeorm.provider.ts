import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.configService.getOrThrow<string>('POSTGRES_HOST', 'localhost'),
      port: this.configService.getOrThrow<number>('POSTGRES_PORT', 5432),
      username: this.configService.getOrThrow<string>(
        'POSTGRES_USERNAME',
        'petargojun',
      ),
      password: this.configService.getOrThrow<string>('POSTGRES_PASSWORD', ''),
      database: this.configService.getOrThrow<string>(
        'POSTGRES_DATABASE',
        'movies-db',
      ),
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Path to entity files
      synchronize: this.configService.getOrThrow<boolean>(
        'POSTGRES_SYNCHRONIZE',
        true,
      ), // Auto-create database tables (in development)
    };
  }
}
