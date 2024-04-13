import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMovieDto {
  @ApiPropertyOptional({ example: 'Title' })
  @IsString({ message: 'Title must be a string' })
  @MaxLength(100, { message: 'Title must be less than 100 characters' })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'This is a description.' })
  @IsString({ message: 'Desctipion must be a string' })
  @MaxLength(200, { message: 'Description must be less than 200 characters' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: new Date() })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Date must be a date' })
  @IsOptional()
  releaseDate?: Date;
}
