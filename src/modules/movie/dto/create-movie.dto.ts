import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IMovie } from '../interfaces/movie.entity.interface';

export class CreateMovieDto implements Partial<IMovie> {
  @ApiProperty({ example: 'Title' })
  @IsString({ message: 'Title must be a string' })
  @MaxLength(100, { message: 'Title must be less than 100 characters' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({ example: 'This is a description.' })
  @IsString({ message: 'Desctipion must be a string' })
  @MaxLength(200, { message: 'Description must be less than 200 characters' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty({ example: new Date() })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Date must be a date' })
  @IsNotEmpty({ message: 'Title is required' })
  releaseDate: Date;

  @ApiPropertyOptional({ example: ['Action', 'Comedy'] })
  @IsString({ each: true, message: 'Genre names must be strings' })
  @IsOptional()
  genreNames?: string[];
}
