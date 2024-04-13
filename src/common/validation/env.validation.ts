import { Transform, plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentValidation {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString({ message: 'POSTGRES_HOST must be a string' })
  @IsNotEmpty()
  POSTGRES_HOST!: string;

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'POSTGRES_PORT must be a number' })
  @IsNotEmpty()
  POSTGRES_PORT!: number;

  @IsString({ message: 'POSTGRES_USERNAME must be a string' })
  @IsNotEmpty()
  POSTGRES_USERNAME!: string;

  @IsString({ message: 'POSTGRES_PASSWORD must be a string' })
  @IsOptional()
  POSTGRES_PASSWORD!: string;

  @IsString({ message: 'POSTGRES_DATABASE must be a string' })
  @IsNotEmpty()
  POSTGRES_DATABASE!: string;

  @Transform(({ value }) => Boolean(value))
  @IsBoolean({ message: 'POSTGRES_SYNCHRONIZE must be a boolean' })
  POSTGRES_SYNCHRONIZE!: boolean;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentValidation, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
